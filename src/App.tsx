/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { auth, db, testConnection, handleFirestoreError, OperationType } from "./lib/firebase";
import { AuctionRoom, FranchiseMember, DraftLog, RosterConfig, LogType } from "./types";
import { IPL_PLAYERS_POOL } from "./data/players";
import { CreateLobby, FRANCHISES } from "./components/CreateLobby";
import { ActiveAuction } from "./components/ActiveAuction";
import { RosterDashboard } from "./components/RosterDashboard";
import { ChatPanel } from "./components/ChatPanel";
import { Gavel, Copy, LogOut, Loader2, Play, IndianRupee, Users, Shield, Target, AlertCircle, ExternalLink, Lock, RefreshCw } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [guestNameInput, setGuestNameInput] = useState("");

  // Active room configurations
  const [roomId, setRoomId] = useState<string | null>(() => {
    try {
      const hash = window.location.hash.replace("#", "").trim().toUpperCase();
      if (hash && hash.startsWith("IPL")) {
        return hash;
      }
      return localStorage.getItem("ipl_auction_room_id") || null;
    } catch {
      return null;
    }
  });
  const [roomData, setRoomData] = useState<AuctionRoom | null>(null);
  const [logs, setLogs] = useState<DraftLog[]>([]);

  // Keep localStorage and URL hash updated when roomId changes
  useEffect(() => {
    try {
      if (roomId) {
        localStorage.setItem("ipl_auction_room_id", roomId);
        if (window.location.hash !== `#${roomId}`) {
          window.location.hash = roomId;
        }
      } else {
        localStorage.removeItem("ipl_auction_room_id");
        if (window.location.hash) {
          window.location.hash = "";
        }
      }
    } catch (e) {
      console.error("Failed to update storage or hash:", e);
    }
  }, [roomId]);

  // Analytics Custom Weights
  const [weights, setWeights] = useState({
    runsWeight: 50,
    strikeRateWeight: 60,
    wicketsWeight: 50,
    economyWeight: 70,
    experienceWeight: 40
  });

  // Local inline join inputs
  const [joinNameInput, setJoinNameInput] = useState("");
  const [joinFranchise, setJoinFranchise] = useState("CSK");

  // Keep franchise defaulted to first unoccupied one
  useEffect(() => {
    if (roomData && currentUser && !roomData.members[currentUser.uid]) {
      const occupied = Object.values(roomData.members).map((m: any) => m.franchiseName);
      const available = FRANCHISES.find(f => !occupied.includes(f.id));
      if (available) {
        setJoinFranchise(available.id);
      }
    }
  }, [roomData, currentUser]);

  // Init auth and connection diagnostics
  useEffect(() => {
    testConnection();
    
    // Look for locally stored guest user
    const savedGuest = localStorage.getItem("ipl_auction_guest_user");
    if (savedGuest) {
      try {
        const parsed = JSON.parse(savedGuest);
        setCurrentUser(parsed);
        if (parsed.uid) {
          const displayName = parsed.displayName || "";
          setJoinNameInput(displayName);
          setGuestNameInput(displayName);
        }
      } catch (e) {
        console.error("Failed to parse saved guest user:", e);
      }
    }
    setIsAuthLoading(false);
  }, []);

  const handleAnonymousSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    const resolvedName = guestNameInput.trim();
    if (!resolvedName) {
      setAuthError("Please enter a valid coach name.");
      setIsSigningIn(false);
      return;
    }

    try {
      // Find or generate a stable guest UID
      let existingUid = "";
      try {
        const savedGuest = localStorage.getItem("ipl_auction_guest_user");
        if (savedGuest) {
          existingUid = JSON.parse(savedGuest).uid;
        }
      } catch {}

      const localGuestUid = existingUid || "coach_" + Math.random().toString(36).substring(2, 11).toUpperCase();
      const localGuestUser = {
        uid: localGuestUid,
        displayName: resolvedName,
        isAnonymous: true
      };
      
      try {
        localStorage.setItem("ipl_auction_guest_user", JSON.stringify(localGuestUser));
      } catch {}
      
      setCurrentUser(localGuestUser);
      setJoinNameInput(resolvedName);
    } catch (err) {
      console.error("Login failed:", err);
      setAuthError("Unexpected login setup failure.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("ipl_auction_guest_user");
    } catch {}
    setCurrentUser(null);
    setAuthError(null);
  };

  // Sync Room ledger entries and real-time bid timer state
  useEffect(() => {
    if (!roomId) {
      setRoomData(null);
      setLogs([]);
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    
    // 1. Sync room state
    const unsubscribeRoom = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomData(snapshot.data() as AuctionRoom);
      } else {
        console.warn("Room does not exist, resetting.");
        setRoomId(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `rooms/${roomId}`);
    });

    // 2. Sync chronological logs for transparency
    const logsRef = collection(db, `rooms/${roomId}/logs`);
    const logsQuery = query(logsRef, orderBy("createdAt", "asc"), limit(100));
    
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const parsedLogs: DraftLog[] = [];
      snapshot.forEach((docSnap) => {
        parsedLogs.push(docSnap.data() as DraftLog);
      });
      setLogs(parsedLogs);
    }, (err) => {
      console.error("Logs sync failed:", err);
    });

    return () => {
      unsubscribeRoom();
      unsubscribeLogs();
    };
  }, [roomId]);

  // Keep track of whether we have successfully been a member of this room
  const [hasBeenMember, setHasBeenMember] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setHasBeenMember(false);
    }
  }, [roomId]);

  // Automatic Kick Watcher
  useEffect(() => {
    if (roomId && roomData && currentUser) {
      const isMember = !!roomData.members[currentUser.uid];
      if (isMember) {
        setHasBeenMember(true);
      } else if (hasBeenMember) {
        // We were a member, but now we are not => we got kicked!
        setRoomId(null);
        setHasBeenMember(false);
        try {
          localStorage.removeItem("ipl_auction_room_id");
          window.location.hash = "";
        } catch {}
        alert("🛡️ You have been kicked from this room by the Admin.");
      }
    }
  }, [roomData, roomId, currentUser, hasBeenMember]);

  // Handle Room Initiation
  const handleCreateRoom = async (
    roomName: string, 
    creatorName: string, 
    franchiseId: string, 
    budgetCr: number, 
    timerSeconds: number,
    slots: RosterConfig,
    isSoloVsAI: boolean
  ) => {
    if (!currentUser) return;
    
    // Generate simple readable 6-character room code
    const generatedCode = "IPL" + Math.floor(100 + Math.random() * 900);
    const budgetLakhs = budgetCr * 100; // e.g. ₹100 Crore = 10000 Lakhs

    const initialMember: FranchiseMember = {
      uid: currentUser.uid,
      name: creatorName,
      franchiseName: franchiseId,
      budgetLakhs: budgetLakhs,
      slots: { BAT: [], BOWL: [], AR: [], WK: [] },
      isHost: true,
      isActive: true
    };

    // Fully randomize/shuffle the player pool sequence (using Fisher-Yates shuffle)
    const randomizedPlayers = [...IPL_PLAYERS_POOL];
    for (let i = randomizedPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedPlayers[i], randomizedPlayers[j]] = [randomizedPlayers[j], randomizedPlayers[i]];
    }

    const membersMap: Record<string, FranchiseMember> = {
      [currentUser.uid]: initialMember
    };

    if (isSoloVsAI) {
      // Automatically fill up the other 9 franchises with smart bot members
      const otherFranchises = FRANCHISES.filter(f => f.id !== franchiseId);
      otherFranchises.forEach(f => {
        const botId = `BOT_SESSION_${f.id}`;
        membersMap[botId] = {
          uid: botId,
          name: `${f.id} AI Bot`,
          franchiseName: f.id,
          budgetLakhs: budgetLakhs,
          slots: { BAT: [], BOWL: [], AR: [], WK: [] },
          isHost: false,
          isActive: true
        };
      });
    }

    const freshRoom: AuctionRoom = {
      id: generatedCode,
      name: roomName,
      hostId: currentUser.uid,
      status: "lobby",
      currentBidLakhs: 0,
      currentBidderId: null,
      currentBidderName: null,
      currentPlayerId: null,
      timerDurationSeconds: timerSeconds,
      timerExpiresAt: null,
      budgetLimitLakhs: budgetLakhs,
      slotsConfig: slots,
      members: membersMap,
      currentPlayerIndex: 0,
      playerPoolIds: randomizedPlayers.map(p => p.id),
      createdAt: new Date().toISOString(),
      gameMode: isSoloVsAI ? "solo" : "multiplayer"
    };

    try {
      await setDoc(doc(db, "rooms", generatedCode), freshRoom);
      
      // Auto write initial log
      const logId = `log_create_${Date.now()}`;
      await setDoc(doc(db, `rooms/${generatedCode}/logs`, logId), {
        id: logId,
        type: LogType.SYSTEM,
        message: `📢 Franchise group initialized by ${creatorName} (${isSoloVsAI ? "Solo vs AI Mode" : "Multiplayer Mode"})! Welcome to the auction room.`,
        createdAt: new Date().toISOString()
      });

      setRoomId(generatedCode);
    } catch (e) {
      console.error("Room creation storage failure:", e);
      alert("Storage write denied. Ensure Firestore rules are compiled.");
    }
  };

  // Handle Joining Existing Room
  const handleJoinRoom = async (targetRoomId: string, joinerName: string, franchiseId: string) => {
    if (!currentUser) return;

    try {
      const roomRef = doc(db, "rooms", targetRoomId);
      const snap = await getDoc(roomRef);

      if (!snap.exists()) {
        alert("Lobby not found. Please review the 6-character Room ID.");
        return;
      }

      const activeRoom = snap.data() as AuctionRoom;

      // Verify franchise tag is not already occupied by another joined human
      const occupiedFranchises = Object.values(activeRoom.members).map(m => m.franchiseName);
      let selectedFranchise = franchiseId;
      if (occupiedFranchises.includes(selectedFranchise)) {
        const unoccupied = FRANCHISES.find(f => !occupiedFranchises.includes(f.id));
        if (unoccupied) {
          selectedFranchise = unoccupied.id;
        } else {
          alert("Lobby is full. Max 10 coaches are permitted in this auction slot.");
          return;
        }
      }

      const freshMember: FranchiseMember = {
        uid: currentUser.uid,
        name: joinerName,
        franchiseName: selectedFranchise,
        budgetLakhs: activeRoom.budgetLimitLakhs,
        slots: { BAT: [], BOWL: [], AR: [], WK: [] },
        isHost: false,
        isActive: true
      };

      // Atomic append member
      await updateDoc(roomRef, {
        [`members.${currentUser.uid}`]: freshMember
      });

      // Write join event log
      const logId = `log_join_${Date.now()}`;
      await setDoc(doc(db, `rooms/${targetRoomId}/logs`, logId), {
        id: logId,
        type: LogType.JOIN,
        message: `🏏 ${joinerName} joined the auction room representing ${selectedFranchise}!`,
        createdAt: new Date().toISOString()
      });

      setRoomId(targetRoomId);
    } catch (e) {
      console.error(e);
      alert("Error joining room.");
    }
  };

  const handleSelectFranchise = async (franchiseId: string) => {
    if (!roomId || !roomData || !currentUser) return;
    
    // Check if another person in the room has already picked this team
    const occupiedBy = Object.values(roomData.members).find(
      (m: any) => m.franchiseName === franchiseId && m.uid !== currentUser.uid
    ) as FranchiseMember | undefined;
    if (occupiedBy) {
      alert(`Franchise ${franchiseId} is already claimed by ${occupiedBy.name}.`);
      return;
    }

    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        [`members.${currentUser.uid}.franchiseName`]: franchiseId
      });

      // Write team picked event log
      const logId = `log_team_pick_${Date.now()}`;
      await setDoc(doc(db, `rooms/${roomId}/logs`, logId), {
        id: logId,
        type: LogType.SYSTEM,
        message: `🏏 ${roomData.members[currentUser.uid]?.name} changed representative franchise to ${franchiseId}!`,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error setting custom franchise identity:", e);
    }
  };

  const handleKickMember = async (memberUid: string, memberName: string) => {
    if (!roomId || !roomData || !currentUser) return;
    if (roomData.hostId !== currentUser.uid) {
      alert("Only the host (admin) can kick players.");
      return;
    }
    if (memberUid === currentUser.uid) {
      alert("You cannot kick yourself.");
      return;
    }

    try {
      const roomRef = doc(db, "rooms", roomId);
      const updatedMembers = { ...roomData.members };
      delete updatedMembers[memberUid];

      await updateDoc(roomRef, {
        members: updatedMembers
      });

      // Write a kicked log
      const logId = `log_kick_${Date.now()}`;
      await setDoc(doc(db, `rooms/${roomId}/logs`, logId), {
        id: logId,
        type: LogType.LEAVE,
        message: `🚫 ${memberName} has been kicked by the Admin!`,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error kicking room member:", e);
      alert("Failed to kick member. Try again.");
    }
  };

  // Host Action: Pull players onto active draft deck blocks
  const handleInitializeDraftPool = async () => {
    if (!roomId || !roomData) return;
    try {
      const firstPlayerId = roomData.playerPoolIds[0];
      await updateDoc(doc(db, "rooms", roomId), {
        status: "bidding",
        currentPlayerId: firstPlayerId,
        currentPlayerIndex: 0,
        currentBidLakhs: 0,
        currentBidderId: null,
        currentBidderName: null,
        timerExpiresAt: Date.now() + (roomData.timerDurationSeconds || 15) * 1000
      });

      const logId = `log_pool_init_${Date.now()}`;
      await setDoc(doc(db, `rooms/${roomId}/logs`, logId), {
        id: logId,
        type: LogType.SYSTEM,
        message: `🏏 Draft player pool initialized. Current player is ${IPL_PLAYERS_POOL.find(p => p.id === firstPlayerId)?.name}. Ready for bids!`,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Leave room clean exit
  const handleLeaveRoom = () => {
    setRoomId(null);
  };

  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    alert(`Room ID Copied: ${roomId}. Share this with friends to join!`);
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="text-sm font-semibold tracking-wide">Syncing with IPL Stadium Core...</p>
      </div>
    );
  }

  // If roomId is selected but room document is not loaded, show loader instead of flickering the lobby
  if (roomId && !roomData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans bg-radial from-neutral-950 to-black">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="text-xs font-semibold tracking-widest text-amber-400 font-mono uppercase">Syncing Room State ({roomId})...</p>
      </div>
    );
  }

  // Authentication Gate Panel (Pure and instant direct guest name entry)
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans p-6 bg-radial from-neutral-950 to-black select-none">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
          <Gavel className="w-16 h-16 text-amber-500 mb-4 animate-pulse" />
          
          <h2 className="text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
            IPL Auction Arena
          </h2>
          <p className="text-xs text-neutral-400 font-mono tracking-wider uppercase mt-1 mb-6">
            REAL-TIME FRANCHISE LEDGER MULTIPLAYER
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnonymousSignIn();
            }}
            className="w-full space-y-4 mb-4 text-left"
          >
            <div>
              <label className="block text-xs font-mono tracking-wider text-neutral-400 uppercase mb-1.5 font-semibold">
                🏏 Choose Coach Name
              </label>
              <div className="relative">
                <input
                  id="direct-coach-name-input"
                  type="text"
                  maxLength={18}
                  placeholder="e.g. Coach Virat"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-3 pr-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button
              id="instant-access-btn"
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 font-mono"
            >
              <Play className="w-4 h-4 fill-current" />
              {isSigningIn ? "Authorizing Coach..." : "Start Draft Instantly"}
            </button>
          </form>

          {authError && (
            <div className="w-full bg-amber-950/20 border border-amber-900/40 rounded-xl p-3 text-left mt-2">
              <div className="flex gap-2 text-amber-400 font-semibold items-start text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Authentication Note</div>
                  <div className="text-[10px] leading-relaxed font-mono mt-0.5 break-words text-neutral-300">
                    {authError}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Top Navigation Frame */}
      <header className="bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <Gavel className="w-8 h-8 text-amber-500 animate-pulse" />
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
              IPL Auction Suite
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-mono">
                P2P Voice Chat
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-mono">
              REAL-TIME FRANCHISE LEDGER MULTIPLAYER
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {roomId && roomData && (
            <div className="flex flex-wrap items-center gap-3 bg-neutral-900/60 px-4 py-2 rounded-xl border border-neutral-850">
              <div className="text-xs">
                <span className="text-neutral-500 uppercase font-mono mr-1">Robby:</span>
                <span className="font-bold text-white max-w-[120px] truncate inline-block align-bottom">{roomData.name}</span>
              </div>
              
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-md font-mono text-xs">
                <span>RM ID: {roomId}</span>
                <button onClick={handleCopyRoomId} className="hover:text-white cursor-pointer ml-1 p-0.5" title="Copy Room Invite Code">
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              <button
                id="exit-lobby-btn"
                onClick={handleLeaveRoom}
                className="text-neutral-500 hover:text-red-400 p-1 rounded-md transition duration-150 cursor-pointer"
                title="Leave Room"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center gap-2.5 bg-neutral-900/60 border border-neutral-850 px-3.5 py-1.5 rounded-xl">
              <div className="text-right">
                <div className="text-xs font-bold text-neutral-200">
                  {currentUser.displayName || roomData?.members[currentUser.uid]?.name || "Coach Guest"}
                </div>
                <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">
                  {currentUser.isAnonymous || !currentUser.email ? "Guest Scout" : "Verified Coach"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-red-400 p-1 rounded-md transition duration-150 cursor-pointer border border-neutral-800 bg-black/40 hover:bg-neutral-850"
                title="Change Representative/Reset Nickname"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Application layouts */}
      <main className="flex-1 p-4 lg:p-6 bg-radial from-neutral-950 to-black">
        {!roomId || !roomData ? (
          <CreateLobby onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
        ) : !roomData.members[currentUser!.uid] ? (
          /* SPECIFIC INLINE JOIN LOBBY PAGE */
          <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-6 animate-fade-in">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
              
              <div className="text-center">
                <Gavel className="w-12 h-12 text-amber-500 mx-auto mb-2 animate-bounce animate-duration-1000" />
                <h3 className="text-xl font-extrabold text-white uppercase tracking-wide">
                  Join Active Auction Room
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  ROOM ID: <span className="text-amber-500 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{roomId}</span>
                </p>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  You are connecting to <span className="text-white font-semibold">{roomData.name}</span>. Please enter your coach name and claim an unoccupied franchise below to join.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans text-neutral-450 mb-1">Your Coach Name</label>
                  <input
                    id="inline-user-name"
                    type="text"
                    maxLength={18}
                    placeholder="e.g. Coach Shubman"
                    value={joinNameInput}
                    onChange={(e) => setJoinNameInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider text-neutral-450 mb-2 uppercase">Claim Representational Franchise</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                    {FRANCHISES.map((franch) => {
                      const occupiedBy = Object.values(roomData.members).find(
                        (m: any) => m.franchiseName === franch.id
                      ) as FranchiseMember | undefined;
                      const isOccupied = !!occupiedBy;
                      const isSelected = joinFranchise === franch.id;

                      return (
                        <button
                          key={franch.id}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setJoinFranchise(franch.id)}
                          className={`flex flex-col p-2.5 rounded-lg border text-left transition duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500 shadow-inner"
                              : isOccupied
                              ? "bg-neutral-950 border-neutral-900/50 opacity-25 cursor-not-allowed"
                              : "bg-neutral-900 border-neutral-850 hover:bg-neutral-800 hover:border-neutral-750"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-xs font-bold text-white">{franch.logoText}</span>
                            {isSelected && (
                              <span className="text-[7.5px] bg-amber-500 text-black font-bold px-1 rounded">CLAIM</span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 truncate mt-0.5 w-full">{franch.name}</span>
                          {isOccupied && occupiedBy && (
                            <span className="text-[8.5px] text-neutral-500 truncate mt-0.5">🔒 {occupiedBy.name}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setRoomId(null)}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white font-semibold py-3 px-4 rounded-lg border border-neutral-800 transition text-xs uppercase font-mono tracking-wide"
                >
                  Exit Room
                </button>
                <button
                  onClick={() => {
                    if (!joinNameInput.trim()) {
                      alert("Please enter your name.");
                      return;
                    }
                    handleJoinRoom(roomId, joinNameInput.trim(), joinFranchise);
                  }}
                  className="flex-[2] bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-lg select-none cursor-pointer text-xs uppercase"
                >
                  <Play className="w-4 h-4" /> Claim & Play
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
            
            {/* LOBBY / WAITING SCREEN IF NO PLAYER SELECTED YET */}
            {!roomData.currentPlayerId ? (
              <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center text-neutral-300 min-h-[500px] flex flex-col items-center justify-between gap-6">
                
                {/* Lobby Intro */}
                <div className="w-full">
                  <Users className="w-12 h-12 text-amber-500 mb-3 mx-auto" />
                  <h3 className="text-base font-extrabold text-white mb-2 uppercase tracking-wide">IPL MEGA AUCTION LOBBY</h3>
                  <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
                    Invite friends using Room ID <span className="font-mono text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-bold">{roomId}</span>. 
                    Set representational franchises below. Once finalized, commence the action!
                  </p>
                </div>

                {/* Sub Grid splits: Left ledger, Right Select-A-Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                  
                  {/* Left Column: Ledger with Kick action */}
                  <div className="flex flex-col gap-3">
                    <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-neutral-900 pb-1.5 mb-3 flex justify-between items-center">
                          <span>📋 COACH DIRECTORY</span>
                          <span className="text-amber-500 font-bold">({Object.keys(roomData.members).length})</span>
                        </div>
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {(Object.values(roomData.members) as FranchiseMember[]).map((member) => (
                            <div key={member.uid} className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 hover:border-neutral-750 transition duration-150">
                              <div className="flex items-center gap-2 max-w-[60%]">
                                <span className="text-xs">👤</span>
                                <div className="truncate">
                                  <span className="text-xs text-white font-semibold block truncate" title={member.name}>
                                    {member.name}
                                  </span>
                                  <span className="text-[9px] font-mono text-neutral-500">
                                    {member.uid === roomData.hostId ? "👑 Host" : "Coach"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded text-amber-400 bg-amber-500/10 border border-amber-500/15">
                                  {member.franchiseName}
                                </span>
                                
                                {/* Kick Button - Host/Admin Only and can't kick self */}
                                {roomData.hostId === currentUser?.uid && member.uid !== currentUser?.uid && (
                                  <button
                                    onClick={() => handleKickMember(member.uid, member.name)}
                                    className="text-[9px] font-mono bg-red-950 hover:bg-red-900 hover:text-white text-red-400 px-1.5 py-0.5 rounded transition border border-red-950 flex items-center justify-center select-none cursor-pointer"
                                    title="Kick Player"
                                  >
                                    KICK
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Launch/Init section inside left card */}
                      <div className="mt-4 pt-3 border-t border-neutral-900">
                        {roomData.hostId === currentUser?.uid ? (
                          <button
                            id="host-draft-init-btn"
                            onClick={handleInitializeDraftPool}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer"
                          >
                            <Target className="w-4 h-4" /> Initialize Draft Pool
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-[10.5px] text-neutral-500 animate-pulse font-mono py-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                            Waiting for Host to start draft...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Click-to-Pick Franchise Board */}
                  <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-neutral-900 pb-1.5 mb-3 flex justify-between items-center">
                      <span>🏏 PICK A TEAM</span>
                      <span className="text-[9px] text-amber-400 font-semibold uppercase">Claim 1 Franchise</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-[350px] overflow-y-auto pr-1">
                      {FRANCHISES.map((franch) => {
                        // Find occupant in room members
                        const occupant = Object.values(roomData.members).find(
                          (m: any) => m.franchiseName === franch.id
                        ) as FranchiseMember | undefined;
                        const isMe = occupant?.uid === currentUser?.uid;
                        const isOther = occupant && !isMe;

                        return (
                          <button
                            key={franch.id}
                            disabled={!!isOther}
                            onClick={() => handleSelectFranchise(franch.id)}
                            className={`flex flex-col items-start p-2 rounded-lg border text-left transition duration-150 relative cursor-pointer ${
                              isMe
                                ? "bg-amber-500/10 border-amber-500/60 shadow-inner ring-1 ring-amber-500/20"
                                : isOther
                                ? "bg-neutral-950/80 border-neutral-900/65 opacity-35 cursor-not-allowed"
                                : "bg-neutral-900/40 border-neutral-850 hover:bg-neutral-800/80 hover:border-neutral-750 active:scale-[0.98]"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[11px] font-bold text-white font-sans">{franch.logoText}</span>
                              {isMe && (
                                <span className="text-[8px] font-mono font-bold text-amber-400 uppercase bg-amber-500/20 px-1 rounded border border-amber-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-400 font-sans truncate w-full mt-0.5">
                              {franch.name}
                            </span>
                            {isOther && occupant && (
                              <span className="text-[8.5px] text-red-500 font-mono font-semibold block truncate w-full mt-0.5">
                                🔒 {occupant.name}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* ACTIVE AUCTION GRID ROUTING */
              <div className="lg:col-span-8 flex flex-col gap-6">
                <ActiveAuction 
                  room={roomData} 
                  activeMemberId={currentUser!.uid} 
                  logs={logs}
                  weights={weights}
                />
                
                {/* Team roster layouts displayed nicely relative at bottom or tab card */}
                <RosterDashboard room={roomData} activeMemberId={currentUser!.uid} />
              </div>
            )}

            {/* Right Chat and Communication pane */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ChatPanel 
                roomId={roomId} 
                activeMemberId={currentUser!.uid} 
                activeMemberName={roomData.members[currentUser!.uid]?.name || "Scout Coach"}
                room={roomData}
              />
            </div>

          </div>
        )}
      </main>

      <footer className="bg-neutral-950 border-t border-neutral-900 py-3 text-center text-neutral-500 text-[10px] font-mono mt-auto">
        © {new Date().getFullYear()} IPL AUCTION REAL-TIME MULTIPLAYER SUITE • ENGAGED UNDER THE STADIUM STACKS
      </footer>
    </div>
  );
}
