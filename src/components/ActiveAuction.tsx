/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Gavel, Clock, Play, Pause, ChevronRight, RefreshCw, AlertCircle, Eye, LogOut, CheckCircle, HelpCircle } from "lucide-react";
import { doc, updateDoc, setDoc, arrayUnion, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { AuctionRoom, DraftLog, LogType, IPLPlayer, PlayerCategory, FranchiseMember } from "../types";
import { IPL_PLAYERS_POOL, PLAYER_SETS } from "../data/players";
import { FRANCHISES } from "./CreateLobby";

interface ActiveAuctionProps {
  room: AuctionRoom;
  activeMemberId: string;
  logs: DraftLog[];
  weights: any;
}

export const ActiveAuction: React.FC<ActiveAuctionProps> = ({ 
  room, 
  activeMemberId, 
  logs,
  weights 
}) => {
  const currentMember = room.members[activeMemberId];
  const isHost = room.hostId === activeMemberId;
  const activePlayer = IPL_PLAYERS_POOL.find(p => p.id === room.currentPlayerId);

  // Computed visual properties
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isBotEnabled, setIsBotEnabled] = useState<boolean>(room.gameMode !== "multiplayer");
  const [activeTab, setActiveTab] = useState<"pool" | "logs">("logs");

  // Timer Ticker Loop
  useEffect(() => {
    if (room.status !== "bidding" || !room.timerExpiresAt) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.round((room.timerExpiresAt! - now) / 1000));
      setTimeLeft(diff);

      // Trigger automatic host transition: Sold/Unsold when time runs out
      if (diff === 0 && isHost) {
        clearInterval(interval);
        handleAuctionTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room.status, room.timerExpiresAt, isHost, room.currentPlayerId, room.currentBidLakhs]);

  // --- AUTOMATED IPL AI BOT ENGINE ---
  // Runs on the room host's browser. If enabled, non-human controlled franchises bid on players.
  useEffect(() => {
    if (!isHost || room.status !== "bidding" || !isBotEnabled || !activePlayer || room.gameMode === "multiplayer") return;
    
    // Schedule a bot to evaluate and place intermediate bids
    const botCheckTimeout = setTimeout(async () => {
      const now = Date.now();
      const timeRemaining = Math.round((room.timerExpiresAt! - now) / 1000);
      
      // If time is too low (sold already) or just refreshed, bid comfortably
      if (timeRemaining <= 1 || timeRemaining > ((room.timerDurationSeconds || 15) - 1)) return;

      // Identify franchises NOT controlled by real human members in this room
      const activeHumanFranchises = (Object.values(room.members) as FranchiseMember[]).map(m => m.franchiseName);
      const eligibleBots = FRANCHISES.filter(f => !activeHumanFranchises.includes(f.id));

      if (eligibleBots.length === 0) return;

      // Select a random bot to evaluate
      const selectedBotConfig = eligibleBots[Math.floor(Math.random() * eligibleBots.length)];
      
      // Look up if this bot can afford a bid, and if they have slot room
      // To simulate other players, we generate structural bot-squad budgets
      const botUid = `BOT_SESSION_${selectedBotConfig.id}`;
      let botState = room.members[botUid];

      if (!botState) {
        // Initialize bot state inside room members on the fly
        botState = {
          uid: botUid,
          name: `${selectedBotConfig.id} AutoBot`,
          franchiseName: selectedBotConfig.id,
          budgetLakhs: room.budgetLimitLakhs,
          slots: { BAT: [], BOWL: [], AR: [], WK: [] },
          isHost: false,
          isActive: true
        };
      }

      // 1. Verifications: Can bot fit this player into active roster with limit checks?
      const getBotOverseasCount = () => {
        let count = 0;
        const slotsObj = botState.slots || { BAT: [], BOWL: [], AR: [], WK: [] };
        const lists = [slotsObj.BAT, slotsObj.BOWL, slotsObj.AR, slotsObj.WK];
        lists.forEach((playerList) => {
          if (!playerList) return;
          playerList.forEach((pId) => {
            const p = IPL_PLAYERS_POOL.find((playerObj) => playerObj.id === pId);
            if (p && p.country === "Overseas") count++;
          });
        });
        return count;
      };

      const getBotSquadCount = () => {
        const slotsObj = botState.slots || { BAT: [], BOWL: [], AR: [], WK: [] };
        return (slotsObj.BAT?.length || 0) + (slotsObj.BOWL?.length || 0) + (slotsObj.AR?.length || 0) + (slotsObj.WK?.length || 0);
      };

      if (getBotSquadCount() >= 25) return; // Squad full!
      if (activePlayer.country === "Overseas" && getBotOverseasCount() >= 8) return; // Overseas limit reached!

      // Compute Bot custom valuation price limit
      const baseEstimateMultiplier = 1.2 + (activePlayer.stats.matches / 400); // Superstar premium
      const botMaxPriceLakhs = Math.round(activePlayer.basePriceLakhs * baseEstimateMultiplier);

      const nextBidLakhs = calculateNextBid(room.currentBidLakhs || activePlayer.basePriceLakhs);

      // 2. Verification: Can Bot afford the cost inside remaining budget purse?
      if (nextBidLakhs < botState.budgetLakhs && nextBidLakhs <= botMaxPriceLakhs) {
        // AI bot places a bid with 35% probability each tick to sound natural
        if (Math.random() < 0.4 && room.currentBidderId !== botUid) {
          await placeBidDirectly(botUid, selectedBotConfig.logoText, nextBidLakhs);
        }
      }
    }, 3200);

    return () => clearTimeout(botCheckTimeout);
  }, [isHost, room.status, room.timerExpiresAt, isBotEnabled, room.currentBidLakhs, room.currentPlayerId]);

  // Handle auto sold / unsold when bid countdown expires
  const handleAuctionTimeout = async () => {
    if (!room.currentPlayerId) return;

    if (room.currentBidderId) {
      // Sold!
      await commitSoldTransaction(room.currentBidderId, room.currentBidLakhs);
    } else {
      // Unsold!
      await commitUnsoldTransaction();
    }
  };

  const calculateNextBid = (currentBid: number): number => {
    if (currentBid === 0) return activePlayer ? activePlayer.basePriceLakhs : 20;

    // Direct IPL Bidding Slab Ladder Logic
    if (currentBid < 100) { // Under ₹1 Crore: Increments of ₹5 Lakhs
      return currentBid + 5;
    } else if (currentBid < 500) { // ₹1 Cr - ₹5 Cr: Increments of ₹20 Lakhs
      return currentBid + 20;
    } else { // Over ₹5 Crore: Increments of ₹50 Lakhs
      return currentBid + 50;
    }
  };

  // Helper to count overseas players in a franchise squad
  const getOverseasCount = (member: FranchiseMember): number => {
    let count = 0;
    const slotsObj = member.slots || { BAT: [], BOWL: [], AR: [], WK: [] };
    const lists = [slotsObj.BAT, slotsObj.BOWL, slotsObj.AR, slotsObj.WK];
    lists.forEach((playerList) => {
      if (!playerList) return;
      playerList.forEach((pId) => {
        const p = IPL_PLAYERS_POOL.find((playerObj) => playerObj.id === pId);
        if (p && p.country === "Overseas") {
          count++;
        }
      });
    });
    return count;
  };

  const getSquadCount = (member: FranchiseMember): number => {
    const slotsObj = member.slots || { BAT: [], BOWL: [], AR: [], WK: [] };
    return (slotsObj.BAT?.length || 0) + (slotsObj.BOWL?.length || 0) + (slotsObj.AR?.length || 0) + (slotsObj.WK?.length || 0);
  };

  const executePlaceBid = async () => {
    if (!activePlayer || room.status !== "bidding") return;
    if (timeLeft <= 0) return;

    // Block bid if same user is already highest bidder
    if (room.currentBidderId === activeMemberId) return;

    // Squad Size Verification: Max 25 players rule
    if (getSquadCount(currentMember) >= 25) {
      alert("Squad Limit Reached: Your franchise already has the maximum allowed limit of 25 players on the roster.");
      return;
    }

    // Overseas Verification: Max 8 overseas rule
    if (activePlayer.country === "Overseas" && getOverseasCount(currentMember) >= 8) {
      alert("Overseas Limit Reached: Your franchise already has the maximum allowed limit of 8 overseas players in the squad.");
      return;
    }

    const nextBidLakhs = calculateNextBid(room.currentBidLakhs);

    // Purse Verification: Check if bidder can afford inside budget limit
    if (nextBidLakhs > currentMember.budgetLakhs) {
      alert("Purse exhausted: You do not have sufficient remaining budget for this bid.");
      return;
    }

    await placeBidDirectly(activeMemberId, currentMember.franchiseName, nextBidLakhs);
  };

  const placeBidDirectly = async (bidderUid: string, bidderName: string, bidLakhs: number) => {
    try {
      const roomRef = doc(db, "rooms", room.id);
      
      // Update room bid parameters
      await updateDoc(roomRef, {
        currentBidLakhs: bidLakhs,
        currentBidderId: bidderUid,
        currentBidderName: bidderName,
        timerExpiresAt: Date.now() + (room.timerDurationSeconds || 15) * 1000 // Add dynamic ticking countdown
      });

      // Write transaction Log
      const logId = `log_bid_${Date.now()}`;
      await setDoc(doc(db, `rooms/${room.id}/logs`, logId), {
        id: logId,
        type: LogType.BID,
        message: `${bidderName} placed a bid of ₹${(bidLakhs / 100).toFixed(2)} Cr for ${activePlayer?.name}!`,
        playerId: activePlayer?.id,
        playerName: activePlayer?.name,
        amountLakhs: bidLakhs,
        createdAt: new Date().toISOString()
      });

      // Maintain Bot registration state in Room mapping if it's a Bot bid
      if (bidderUid.startsWith("BOT_SESSION_")) {
        const botFranchiseId = bidderUid.replace("BOT_SESSION_", "");
        const botConfig = FRANCHISES.find(f => f.id === botFranchiseId);

        if (!room.members[bidderUid] && botConfig) {
          const freshBotState = {
            uid: bidderUid,
            name: `${botConfig.id} Bot`,
            franchiseName: botConfig.id,
            budgetLakhs: room.budgetLimitLakhs,
            slots: { BAT: [], BOWL: [], AR: [], WK: [] },
            isHost: false,
            isActive: true
          };
          
          await updateDoc(roomRef, {
            [`members.${bidderUid}`]: freshBotState
          });
        }
      }
    } catch (e) {
      console.error("Bid error:", e);
    }
  };

  // Host Action: Trigger Bidding Play state
  const handleHostStartBidding = async () => {
    if (!activePlayer) return;
    try {
      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        status: "bidding",
        currentBidLakhs: 0,
        currentBidderId: null,
        currentBidderName: null,
        timerExpiresAt: Date.now() + (room.timerDurationSeconds || 15) * 1000
      });

      const logId = `log_start_${Date.now()}`;
      await setDoc(doc(db, `rooms/${room.id}/logs`, logId), {
        id: logId,
        type: LogType.SYSTEM,
        message: `Auction bidding commenced for ${activePlayer.name} with Base Price ₹${(activePlayer.basePriceLakhs / 100).toFixed(2)} Cr`,
        playerId: activePlayer.id,
        playerName: activePlayer.name,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
       console.error(e);
    }
  };

  // Host Action: Pause Timer countdown
  const handleHostPauseBidding = async () => {
    try {
      await updateDoc(doc(db, "rooms", room.id), {
        status: "paused"
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Host Action: Skip player entirely
  const handleHostSkipPlayer = async () => {
    try {
      moveToNextPlayer(room.currentPlayerIndex + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const commitSoldTransaction = async (buyerUid: string, amLakhs: number) => {
    try {
      if (!activePlayer) return;
      const roomRef = doc(db, "rooms", room.id);
      const buyerMember = room.members[buyerUid];

      if (!buyerMember) return;

      // Calculate new balance
      const newBudgetLakhs = Math.max(0, buyerMember.budgetLakhs - amLakhs);
      
      // Append drafted player ID to slots
      const updatedCategorySlots = [...(buyerMember.slots[activePlayer.category] || []), activePlayer.id];

      // Atomic Firebase state update
      try {
        await updateDoc(roomRef, {
          status: "lobby", // reset to lobby
          [`members.${buyerUid}.budgetLakhs`]: newBudgetLakhs,
          [`members.${buyerUid}.slots.${activePlayer.category}`]: updatedCategorySlots,
          currentBidLakhs: 0,
          currentBidderId: null,
          currentBidderName: null,
          timerExpiresAt: null
        });
      } catch (err) {
        console.error("Sold write fail: room updateDoc failed", err);
        handleFirestoreError(err, OperationType.UPDATE, `rooms/${room.id}`);
      }

      // Write Sold transaction log
      const logId = `log_sold_${Date.now()}`;
      try {
        await setDoc(doc(db, `rooms/${room.id}/logs`, logId), {
          id: logId,
          type: LogType.SOLD,
          message: `🔥 SOLD! ${activePlayer.name} joins ${buyerMember.franchiseName} for ₹${(amLakhs / 100).toFixed(2)} Cr!`,
          playerId: activePlayer.id,
          playerName: activePlayer.name,
          amountLakhs: amLakhs,
          buyerId: buyerUid,
          buyerName: buyerMember.franchiseName,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Sold write fail: log setDoc failed", err);
        handleFirestoreError(err, OperationType.CREATE, `rooms/${room.id}/logs/${logId}`);
      }

      // FRANCHISE CELEBRATIONS DICTIONARY FOR CONGRATULATORY CHAT MOTTO ANNOUNCEMENTS
      const FRANCHISE_CELEBRATIONS: Record<string, { hashtag: string; slogan: string; color: string }> = {
        CSK: { hashtag: "#WhistlePodu", slogan: "Yellove is all you need!", color: "💛" },
        MI: { hashtag: "#OneFamily", slogan: "Duniya Hila Denge Hum!", color: "💙" },
        RCB: { hashtag: "#PlayBold", slogan: "Ee Sala Cup Namde!", color: "❤️" },
        KKR: { hashtag: "#AmiKKR", slogan: "Korbo Lorbo Jeetbo Re!", color: "💜" },
        SRH: { hashtag: "#OrangeArmy", slogan: "Play with Fire!", color: "🧡" },
        RR: { hashtag: "#HallaBol", slogan: "Once a Royal, Always a Royal!", color: "💖" },
        GT: { hashtag: "#AavaDe", slogan: "Aava De! Titans are here!", color: "🖤" },
        LSG: { hashtag: "#AbApniBaariHai", slogan: "Ab Apni Baari Hai!", color: "🩵" },
        DC: { hashtag: "#RoarMachaa", slogan: "Roar Machaa! Yeh Hai Nayi Dilli!", color: "💙" },
        PBKS: { hashtag: "#SaddaPunjab", slogan: "Sadda Punjab! Sher Squad!", color: "❤️" }
      };

      const celeb = FRANCHISE_CELEBRATIONS[buyerMember.franchiseName] || { hashtag: "#IPLAuction", slogan: "Let's Go!", color: "🏏" };
      const soldChatMessageText = `🎉 CONGRATULATIONS to ${buyerMember.name} (${buyerMember.franchiseName}) on signing ${activePlayer.name} for ₹${(amLakhs / 100).toFixed(2)} Cr! ${celeb.color} ${celeb.hashtag} - "${celeb.slogan}"`;
      
      const chatMsgId = `chat_sold_${Date.now()}`;
      try {
        await setDoc(doc(db, `rooms/${room.id}/chats`, chatMsgId), {
          id: chatMsgId,
          senderId: "SYSTEM_BOT",
          senderName: "🔔 AUCTIONEER BOSS",
          text: soldChatMessageText,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Sold write fail: chat setDoc failed", err);
        handleFirestoreError(err, OperationType.CREATE, `rooms/${room.id}/chats/${chatMsgId}`);
      }

      // Auto Advance to next roster item
      moveToNextPlayer(room.currentPlayerIndex + 1);
    } catch (e) {
      console.error("Sold write fail general catch:", e);
    }
  };

  const commitUnsoldTransaction = async () => {
    try {
      if (!activePlayer) return;
      const roomRef = doc(db, "rooms", room.id);

      await updateDoc(roomRef, {
        status: "lobby",
        timerExpiresAt: null
      });

      const logId = `log_unsold_${Date.now()}`;
      await setDoc(doc(db, `rooms/${room.id}/logs`, logId), {
        id: logId,
        type: LogType.UNSOLD,
        message: `📢 UNSOLD! Bid timer elapsed with zero offers for ${activePlayer.name}.`,
        playerId: activePlayer.id,
        playerName: activePlayer.name,
        createdAt: new Date().toISOString()
      });

      const unsoldMessage = `❌ UNSOLD: ${activePlayer.name} (Base Price ₹${(activePlayer.basePriceLakhs / 100).toFixed(2)} Cr) goes unsold! Ready for re-entry later inside the pool sequence. 🏏`;
      const chatMsgId = `chat_unsold_${Date.now()}`;
      await setDoc(doc(db, `rooms/${room.id}/chats`, chatMsgId), {
        id: chatMsgId,
        senderId: "SYSTEM_BOT",
        senderName: "🔔 AUCTIONEER BOSS",
        text: unsoldMessage,
        createdAt: new Date().toISOString()
      });

      moveToNextPlayer(room.currentPlayerIndex + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const moveToNextPlayer = async (targetIndex: number) => {
    const roomRef = doc(db, "rooms", room.id);
    if (targetIndex >= room.playerPoolIds.length) {
      // Completed pool!
      await updateDoc(roomRef, {
        status: "finished",
        currentPlayerId: null
      });
      return;
    }

    const nextId = room.playerPoolIds[targetIndex];
    await updateDoc(roomRef, {
      status: "bidding",
      currentPlayerIndex: targetIndex,
      currentPlayerId: nextId,
      currentBidLakhs: 0,
      currentBidderId: null,
      currentBidderName: null,
      timerExpiresAt: Date.now() + (room.timerDurationSeconds || 15) * 1000
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      
      {/* Player Block Header & Status indicators */}
      <div className="flex flex-col bg-neutral-950 p-4 border border-neutral-850 rounded-xl mb-4 gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              ACTIVE BLOCK: {room.currentPlayerIndex + 1} OF {room.playerPoolIds.length}
            </span>
            <h2 className="text-xl font-sans font-extrabold text-white">
              {activePlayer ? activePlayer.name : "Waiting For Block..."}
            </h2>
            <div className="flex gap-2 mt-1">
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded-full">
                {activePlayer?.category}
              </span>
              <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded-full">
                {activePlayer?.country}
              </span>
              <span className="bg-neutral-800 text-neutral-400 font-mono text-[10px] px-2 py-0.5 rounded-full">
                {activePlayer?.teamAssociation}
              </span>
            </div>
          </div>

          {/* Timer view */}
          <div className="flex items-center gap-3 animate-fade-in">
            {room.status === "bidding" ? (
              <div className={`p-3 rounded-lg border flex items-center gap-2 font-mono ${
                timeLeft <= 4 
                  ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                <Clock className="w-5 h-5" />
                <div className="text-xl font-black">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex items-center gap-2 font-mono text-neutral-500 text-sm">
                <Pause className="w-4 h-4" />
                <span>TIMER ARRESTED</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic and fully synchronized randomized Upcoming Players List */}
        {(() => {
          const upcomingPlayerIds = room.playerPoolIds.slice(room.currentPlayerIndex + 1, room.currentPlayerIndex + 6);
          const upcomingPlayers = upcomingPlayerIds.map(id => IPL_PLAYERS_POOL.find(p => p.id === id)).filter(Boolean) as IPLPlayer[];
          if (upcomingPlayers.length === 0) return null;
          return (
            <div className="border-t border-neutral-850/80 pt-3">
              <span className="text-[9px] font-mono tracking-widest text-amber-500/80 block uppercase mb-2 font-black flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                UPCOMING DRAFT LINEUP (RANDOMIZED DECK)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {upcomingPlayers.map((p, idx) => (
                  <div key={p.id} className="bg-neutral-900/40 p-2 rounded-lg border border-neutral-850/70 flex flex-col justify-between hover:border-amber-500/20 transition duration-150">
                    <div>
                      <span className="text-[8px] font-mono text-neutral-500 block">Queue #{room.currentPlayerIndex + 2 + idx}</span>
                      <span className="text-xs font-bold text-neutral-200 block truncate mt-0.5" title={p.name}>{p.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[8px] px-1 bg-neutral-950 border border-neutral-850 rounded font-mono text-neutral-400 capitalize">{p.category}</span>
                      <span className="text-[9px] font-mono font-bold text-amber-400">₹{(p.basePriceLakhs / 100).toFixed(2)} Cr</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Stats and Bidding layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[290px]">
        {/* Statistics section */}
        <div id="player-banner-block" className="lg:col-span-7 bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase border-b border-neutral-850 pb-1 mb-2">
              Career Statistics Ledger
            </div>
            
            {activePlayer ? (
              <div className="grid grid-cols-3 gap-2 text-center mt-2">
                <div className="bg-neutral-900/60 p-2.5 rounded border border-neutral-850">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">MATCHES</span>
                  <span className="font-mono font-bold text-white text-base">{activePlayer.stats.matches}</span>
                </div>
                
                {/* Runs and average if present */}
                {(activePlayer.category === PlayerCategory.BAT || activePlayer.category === PlayerCategory.WK || activePlayer.category === PlayerCategory.AR) && (
                  <>
                    <div className="bg-neutral-900/60 p-2.5 rounded border border-neutral-850">
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">RUNS</span>
                      <span className="font-mono font-bold text-white text-base">{activePlayer.stats.runs || "—"}</span>
                    </div>
                    <div className="bg-neutral-900/60 p-2.5 rounded border border-neutral-850">
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">STRIKE RATE</span>
                      <span className="font-mono font-bold text-teal-400 text-base">{activePlayer.stats.strikeRate || "—"}</span>
                    </div>
                  </>
                )}

                {/* Bowling stats if bowler or all-rounder */}
                {(activePlayer.category === PlayerCategory.BOWL || activePlayer.category === PlayerCategory.AR) && (
                  <>
                    <div className="bg-neutral-900/60 p-2.5 rounded border border-neutral-850">
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">WICKETS</span>
                      <span className="font-mono font-bold text-white text-base">{activePlayer.stats.wickets || "—"}</span>
                    </div>
                    <div className="bg-neutral-900/60 p-2.5 rounded border border-neutral-850">
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">ECONOMY</span>
                      <span className="font-mono font-bold text-pink-400 text-base">{activePlayer.stats.economy || "—"}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">No player on auction board</p>
            )}
          </div>

          <div className="border-t border-neutral-850 mt-4 pt-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 block uppercase">BASE PRICE</span>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                ₹{(activePlayer ? activePlayer.basePriceLakhs / 100 : 0).toFixed(2)} Crore
              </span>
            </div>

            {/* AI Opponent configuration toggle */}
            {room.gameMode !== "multiplayer" ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">✨ Challenger Bots</span>
                <button
                  id="toggle-ai-bots"
                  onClick={() => setIsBotEnabled(!isBotEnabled)}
                  className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                    isBotEnabled 
                      ? "bg-amber-500 text-black border border-amber-400" 
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                  }`}
                >
                  {isBotEnabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            ) : (
              <span className="text-[10.5px] font-mono text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900/60 font-medium">
                👥 MULTIPLAYER MAIN (Bots Blocked)
              </span>
            )}
          </div>
        </div>

        {/* Bidding Control section */}
        <div id="bidding-control-pad" className="lg:col-span-5 bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase border-b border-neutral-850 pb-1 mb-3">
              TENDER PLATFORM
            </div>

            <div className="text-center py-3 bg-neutral-900/40 border border-neutral-850 rounded-lg">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                Highest Valid Bid
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {room.currentBidLakhs > 0 ? (
                  `₹${(room.currentBidLakhs / 100).toFixed(2)} Cr`
                ) : (
                  <span className="text-neutral-600 text-lg font-bold">No Bids Placed Yet</span>
                )}
              </div>
              
              {room.currentBidderName && (
                <div className="text-xs text-neutral-300 font-sans mt-1.5 font-medium">
                  Bidder: <span className="text-white bg-neutral-950 px-2 py-0.5 border border-neutral-800 rounded font-bold">{room.currentBidderName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {room.status === "lobby" ? (
              <div className="text-center text-xs text-neutral-400 italic py-2">
                Wait for the room host to initiate active block bidding.
              </div>
            ) : (
              <button
                id="place-active-bid-btn"
                onClick={executePlaceBid}
                disabled={room.currentBidderId === activeMemberId || room.status !== "bidding" || timeLeft <= 0 || !activePlayer}
                className={`w-full font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-1.5 transition text-sm ${
                  room.currentBidderId === activeMemberId
                    ? "bg-amber-500/20 text-amber-400/80 border border-amber-500/20 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-black shadow-lg transform active:scale-[0.98]"
                }`}
              >
                <Gavel className="w-4 h-4" />
                {room.currentBidderId === activeMemberId ? (
                  "YOU HAVE THE HIGHEST BID"
                ) : (
                  activePlayer ? (
                    `BID ₹${(calculateNextBid(room.currentBidLakhs) / 100).toFixed(2)} CR`
                  ) : (
                    "PLACE BID"
                  )
                )}
              </button>
            )}
            
            {/* Host controllers panel */}
            {isHost && (
              <div className="border-t border-neutral-850 pt-2.5 mt-2.5 space-y-1.5">
                <span className="text-[8px] font-mono text-amber-400 block tracking-widest uppercase">
                  HOST DECK CONTROLLER
                </span>
                
                {room.status === "lobby" ? (
                  <button
                    id="host-start-bid-btn"
                    onClick={handleHostStartBidding}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-md text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Player Auction Block
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      id="host-pause-bid-btn"
                      onClick={handleHostPauseBidding}
                      className="bg-neutral-800 hover:bg-neutral-750 text-neutral-200 py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Pause className="w-3.5 h-3.5" /> Arrest Clock
                    </button>
                    <button
                      id="host-skip-player-btn"
                      onClick={handleHostSkipPlayer}
                      className="bg-neutral-800 hover:bg-neutral-750 text-neutral-200 py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      Skip <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Section - Logs and Player Pool */}
      <div id="draft-drawer-panels" className="mt-5 border-t border-neutral-800 pt-4 flex-1 flex flex-col min-h-[190px]">
        {/* Toggle tabs */}
        <div className="flex border-b border-neutral-850 mb-3 text-xs">
          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-2 px-4 font-sans font-semibold transition border-b-2 ${
              activeTab === "logs"
                ? "text-amber-400 border-amber-400"
                : "text-neutral-450 hover:text-white"
            }`}
          >
            Transaction Logs & Bids
          </button>
          <button
            onClick={() => setActiveTab("pool")}
            className={`pb-2 px-4 font-sans font-semibold transition border-b-2 ${
              activeTab === "pool"
                ? "text-amber-400 border-amber-400"
                : "text-neutral-450 hover:text-white"
            }`}
          >
            Draft Player Pool List
          </button>
        </div>

        {/* Tab content Box */}
        <div className="flex-1 overflow-y-auto max-h-[140px] pr-1">
          {activeTab === "logs" ? (
            <div className="space-y-1 text-[11px] font-mono text-neutral-300">
              {logs.length === 0 ? (
                <p className="text-neutral-500 italic text-center py-4">No auction logs indexed.</p>
              ) : (
                logs.slice().reverse().map((log) => (
                  <div 
                    key={log.id} 
                    className={`p-1.5 rounded flex justify-between gap-2 border ${
                      log.type === LogType.SOLD 
                        ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20 font-bold" 
                        : log.type === LogType.BID 
                          ? "bg-neutral-900 border-neutral-850 text-neutral-350"
                          : "bg-red-950/10 border-red-950/20 text-red-300"
                    }`}
                  >
                    <span>{log.message}</span>
                    <span className="text-[9px] text-neutral-500 shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {PLAYER_SETS.map(set => {
                const setPlayers = IPL_PLAYERS_POOL.filter(p => (p.setId || "FAST") === set.id);
                if (setPlayers.length === 0) return null;
                return (
                  <div key={set.id}>
                    <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-amber-500 mb-2 border-b border-neutral-850 pb-1 flex items-center gap-1.5">
                      <span>{set.icon}</span>
                      <span>{set.name}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {setPlayers.map((p) => {
                        const isSold = (Object.values(room.members) as FranchiseMember[]).some(m => 
                          Object.values(m.slots).flat().includes(p.id)
                        );
                        const isActiveOnBoard = p.id === room.currentPlayerId;

                        return (
                          <div 
                            key={p.id} 
                            className={`p-2 border rounded-lg flex items-center justify-between ${
                              isActiveOnBoard 
                                ? "bg-amber-400/10 border-amber-400/40 text-white font-semibold"
                                : isSold 
                                  ? "bg-neutral-950 text-neutral-600 border-neutral-900 line-through select-none" 
                                  : "bg-neutral-950 text-neutral-300 border-neutral-850"
                            }`}
                          >
                            <div>
                              <div>{p.name}</div>
                              <div className="text-[9px] text-neutral-500 uppercase font-mono">{p.category}</div>
                            </div>
                            {isSold ? (
                              <span className="text-[9px] bg-red-950/20 text-red-500 font-bold border border-red-950 px-1 rounded">SOLD</span>
                            ) : isActiveOnBoard ? (
                              <span className="text-[9px] bg-amber-500 text-black font-bold px-1 rounded animate-pulse">ON DECK</span>
                            ) : (
                              <span className="font-mono text-[10px] text-neutral-450">₹{(p.basePriceLakhs / 100).toFixed(2)} Cr</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
