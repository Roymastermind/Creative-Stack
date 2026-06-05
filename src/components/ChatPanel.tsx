/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, MessageSquare, ShieldAlert, Volume2, HelpCircle } from "lucide-react";
import { collection, onSnapshot, addDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { ChatMessage, AuctionRoom } from "../types";

interface ChatPanelProps {
  roomId: string;
  activeMemberId: string;
  activeMemberName: string;
  room: AuctionRoom;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  roomId, 
  activeMemberId, 
  activeMemberName, 
  room 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Voice WebRTC states
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"disabled" | "connecting" | "active" | "error">("disabled");
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  // WebRTC references
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const signalsUnsubscribeRef = useRef<(() => void) | null>(null);

  // 1. Listen for text chat messages in Firestore
  useEffect(() => {
    const chatsPath = `rooms/${roomId}/chats`;
    const chatsRef = collection(db, chatsPath);
    const q = query(chatsRef, orderBy("createdAt", "asc"), limit(80));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        msgs.push({
          id: doc.id,
          senderId: d.senderId,
          senderName: d.senderName,
          text: d.text,
          createdAt: d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleTimeString() : ""
        });
      });
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, chatsPath);
    });

    return () => {
      unsubscribe();
      cleanupWebRTC();
    };
  }, [roomId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    try {
      const msgData = {
        senderId: activeMemberId,
        senderName: activeMemberName,
        text: chatText.trim(),
        createdAt: serverTimestamp()
      };
      setChatText("");
      await addDoc(collection(db, `rooms/${roomId}/chats`), msgData);
    } catch (error) {
      console.error("Chat send failed:", error);
    }
  };

  // 2. WebRTC Voice Room P2P signaling
  const toggleVoiceMode = async () => {
    if (isMicEnabled) {
      cleanupWebRTC();
      setIsMicEnabled(false);
      setVoiceStatus("disabled");
    } else {
      setVoiceStatus("connecting");
      try {
        // Enforce audio-only stream extraction
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        setIsMicEnabled(true);
        setVoiceStatus("active");
        
        // Setup Firestore P2P signaling receivers next
        setupVoiceSignaling(stream);
      } catch (err) {
        console.warn("Microphone access failed (often blocked by frame restriction if not in new tab):", err);
        setVoiceStatus("error");
        setIsMicEnabled(false);
      }
    }
  };

  const setupVoiceSignaling = (localStream: MediaStream) => {
    const signalsPath = `rooms/${roomId}/signals`;
    const signalsRef = collection(db, signalsPath);

    // Filter incoming signaling documents intended for this client
    signalsUnsubscribeRef.current = onSnapshot(signalsRef, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          // We only process signaling packets routed specifically to us
          if (data.targetId === activeMemberId && data.senderId !== activeMemberId) {
            await handleIncomingSignal(data.senderId, data.type, JSON.parse(data.payload), localStream);
          }
        }
      });
    }, (error) => {
      console.error("Signaling socket failed:", error);
    });

    // Proactively send a handshake offer signal to other members in the room
    Object.keys(room.members).forEach(async (peerUid) => {
      if (peerUid !== activeMemberId) {
        await initiatePeerConnection(peerUid, localStream);
      }
    });
  };

  const initiatePeerConnection = async (peerUid: string, localStream: MediaStream) => {
    try {
      const pc = createPeerConnection(peerUid, localStream);
      peerConnectionsRef.current[peerUid] = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send the offer to Firestore
      await addDoc(collection(db, `rooms/${roomId}/signals`), {
        senderId: activeMemberId,
        targetId: peerUid,
        type: "offer",
        payload: JSON.stringify(offer),
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Initiate peer failed for: ", peerUid, e);
    }
  };

  const createPeerConnection = (peerUid: string, localStream: MediaStream): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]
    });

    // Add microphone tracks to the connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(collection(db, `rooms/${roomId}/signals`), {
          senderId: activeMemberId,
          targetId: peerUid,
          type: "candidate",
          payload: JSON.stringify(event.candidate),
          createdAt: serverTimestamp()
        });
      }
    };

    // Playback remote stream when tracks arrive
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      let audioEl = document.getElementById(`audio-peer-${peerUid}`) as HTMLAudioElement;
      if (!audioEl) {
        audioEl = document.createElement("audio");
        audioEl.id = `audio-peer-${peerUid}`;
        audioEl.autoplay = true;
        document.body.appendChild(audioEl);
      }
      audioEl.srcObject = remoteStream;
    };

    return pc;
  };

  const handleIncomingSignal = async (
    peerUid: string, 
    type: "offer" | "answer" | "candidate", 
    payload: any, 
    localStream: MediaStream
  ) => {
    let pc = peerConnectionsRef.current[peerUid];
    
    if (!pc) {
      pc = createPeerConnection(peerUid, localStream);
      peerConnectionsRef.current[peerUid] = pc;
    }

    if (type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(payload));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer back to sender
      await addDoc(collection(db, `rooms/${roomId}/signals`), {
        senderId: activeMemberId,
        targetId: peerUid,
        type: "answer",
        payload: JSON.stringify(answer),
        createdAt: serverTimestamp()
      });
    } else if (type === "answer") {
      if (pc.signalingState !== "stable") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
      }
    } else if (type === "candidate") {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload));
      } catch (e) {
        console.warn("Error adding incoming ICE candidate:", e);
      }
    }
  };

  const cleanupWebRTC = () => {
    if (signalsUnsubscribeRef.current) {
      signalsUnsubscribeRef.current();
      signalsUnsubscribeRef.current = null;
    }

    // Stop and release microphone tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close and remove peer connections
    Object.keys(peerConnectionsRef.current).forEach((key) => {
      peerConnectionsRef.current[key].close();
      const el = document.getElementById(`audio-peer-${key}`);
      if (el) el.remove();
    });
    peerConnectionsRef.current = {};
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col h-full">
      {/* Voice Comm Panel */}
      <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 mb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-sans text-white font-semibold">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Voice Chatroom</span>
          </div>

          <button
            id="toggle-voice-btn"
            onClick={toggleVoiceMode}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium flex items-center gap-1.5 transition ${
              isMicEnabled
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
            }`}
          >
            {isMicEnabled ? (
              <>
                <MicOff className="w-3 h-3" /> MUTE MIC
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" /> UNMUTE MIC
              </>
            )}
          </button>
        </div>

        {/* Status indicator line */}
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-neutral-500 uppercase">Comm Link status:</span>
          {voiceStatus === "disabled" && <span className="text-neutral-500">OFFLINE</span>}
          {voiceStatus === "connecting" && <span className="text-yellow-500 animate-pulse">CONNECTING...</span>}
          {voiceStatus === "active" && <span className="text-emerald-500 font-bold flex items-center gap-1">● AUDIO ONLINE</span>}
          {voiceStatus === "error" && <span className="text-red-400">BLOCKED (OPEN IN NEW TAB)</span>}
        </div>

        {/* Framing constraints disclaimer */}
        {voiceStatus === "error" && (
          <div className="text-[9px] text-zinc-400 bg-neutral-900 p-1.5 rounded flex items-start gap-1">
            <ShieldAlert className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
            <span>
              Chrome iframe restrictions may block mic. Open and play this app in a **New Tab** via the top-right Settings menu for seamless audio conferencing!
            </span>
          </div>
        )}
      </div>

      {/* Message Title */}
      <div className="flex items-center gap-1.5 border-b border-neutral-850 pb-1.5 mb-2.5 text-xs font-sans text-neutral-400 font-semibold uppercase">
        <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
        <span>Live Auction Whisper</span>
      </div>

      {/* Chattings display */}
      <div id="chats-display-box" className="flex-1 overflow-y-auto max-h-[170px] space-y-2 mb-3 pr-1 text-xs font-sans">
        {messages.length === 0 ? (
          <div className="text-center text-neutral-600 italic py-6">
            Banter chamber empty. Enter draft bets below.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="bg-neutral-950 p-2 rounded-lg border border-neutral-850/40">
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mb-0.5">
                <span className="font-semibold text-neutral-300">{m.senderName}</span>
                <span>{m.createdAt}</span>
              </div>
              <p className="text-neutral-200">{m.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sending message bar */}
      <form onSubmit={handleSendChat} className="flex gap-2.5">
        <input
          id="chat-text-input"
          type="text"
          maxLength={240}
          placeholder="Send bidding banter..."
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
        />
        <button
          id="send-chat-btn"
          type="submit"
          className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg text-white transition transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
