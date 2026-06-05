/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Gavel, Settings, Coins } from "lucide-react";
import { RosterConfig } from "../types";

interface CreateLobbyProps {
  onJoinRoom: (roomId: string, name: string, franchise: string) => void;
  onCreateRoom: (roomName: string, name: string, franchise: string, budgetCr: number, timerSeconds: number, slots: RosterConfig, isSoloVsAI: boolean) => void;
}

export const FRANCHISES = [
  { id: "CSK", name: "Chennai Super Kings", color: "bg-yellow-500 text-black border-yellow-300", logoText: "🦁 CSK" },
  { id: "MI", name: "Mumbai Indians", color: "bg-blue-600 text-white border-blue-400", logoText: "⚡ MI" },
  { id: "RCB", name: "Royal Challengers Bengaluru", color: "bg-red-600 text-white border-red-500", logoText: "👑 RCB" },
  { id: "KKR", name: "Kolkata Knight Riders", color: "bg-purple-700 text-white border-purple-500", logoText: "🌌 KKR" },
  { id: "SRH", name: "Sunrisers Hyderabad", color: "bg-orange-600 text-white border-orange-400", logoText: "🔥 SRH" },
  { id: "RR", name: "Rajasthan Royals", color: "bg-pink-600 text-white border-pink-400", logoText: "🛡️ RR" },
  { id: "GT", name: "Gujarat Titans", color: "bg-slate-800 text-white border-slate-600", logoText: "🔱 GT" },
  { id: "LSG", name: "Lucknow Super Giants", color: "bg-cyan-600 text-white border-cyan-400", logoText: "🦅 LSG" },
  { id: "DC", name: "Delhi Capitals", color: "bg-indigo-700 text-white border-indigo-400", logoText: "🐅 DC" },
  { id: "PBKS", name: "Punjab Kings", color: "bg-red-500 text-white border-red-300", logoText: "🦁 PBKS" }
];

export const CreateLobby: React.FC<CreateLobbyProps> = ({ onJoinRoom, onCreateRoom }) => {
  const [activeTab, setActiveTab] = useState<"join" | "create">("join");
  const [name, setName] = useState("");
  const [franchise, setFranchise] = useState("CSK");
  const [roomIdInput, setRoomIdInput] = useState("");
  
  // Create state variables
  const [roomName, setRoomName] = useState("");
  const [isSoloVsAI, setIsSoloVsAI] = useState(true); // Default to separate Player vs AI mode
  const [budgetCr, setBudgetCr] = useState(120); // Default ₹120 Crore purse
  const [timerSeconds, setTimerSeconds] = useState(15); // Default 15s bid timer

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name");
    if (!roomIdInput.trim()) return alert("Please enter a Room ID");
    onJoinRoom(roomIdInput.trim().toUpperCase(), name.trim(), franchise);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name");
    if (!roomName.trim()) return alert("Please enter a room/lobby name");
    
    onCreateRoom(
      roomName.trim(),
      name.trim(),
      franchise,
      budgetCr,
      timerSeconds,
      {
        BAT: 25,
        BOWL: 25,
        AR: 25,
        WK: 25
      },
      isSoloVsAI
    );
  };

  return (
    <div id="create-lobby-screen" className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 p-6 text-center shadow-lg relative">
          <div className="absolute top-3 right-3 bg-black/40 text-xs text-amber-200 px-2 py-0.5 rounded-full border border-amber-400 font-mono">
            IPL MEGA AUCTION
          </div>
          <Gavel id="banner-gavel-icon" className="w-10 h-10 mx-auto text-black mb-2 animate-bounce" />
          <h2 className="text-2xl font-sans tracking-tight font-extrabold text-black uppercase">
            IPL Auction Arena
          </h2>
          <p className="text-sm font-sans font-medium text-black/80">
            Bid. Draft. Dominate. Multiplayer Strategy Suite.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b border-neutral-800">
          <button
            id="tab-join-btn"
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-4 text-center font-sans font-semibold transition ${
              activeTab === "join"
                ? "bg-neutral-850 text-amber-400 border-b-2 border-amber-400"
                : "text-neutral-400 hover:text-white hover:bg-neutral-850"
            }`}
          >
            Join Existing Auction
          </button>
          <button
            id="tab-create-btn"
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-4 text-center font-sans font-semibold transition ${
              activeTab === "create"
                ? "bg-neutral-850 text-amber-400 border-b-2 border-amber-400"
                : "text-neutral-400 hover:text-white hover:bg-neutral-850"
            }`}
          >
            Create New Auction Room
          </button>
        </div>

        <div className="p-6">
          {/* Global User Setup */}
          <div className="mb-6">
            <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
              Step 1: Your Franchise Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans text-neutral-400 mb-1">Your Name</label>
                <input
                  id="user-name-input"
                  type="text"
                  maxLength={18}
                  placeholder="e.g. Coach Rohit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-neutral-400 mb-1">Select IPL Franchise</label>
                <select
                  id="user-franchise-select"
                  value={franchise}
                  onChange={(e) => setFranchise(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                >
                  {FRANCHISES.map((franch) => (
                    <option key={franch.id} value={franch.id}>
                      {franch.logoText} - {franch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr className="border-neutral-800 my-6" />

          {/* TAB: Join */}
          {activeTab === "join" && (
            <form onSubmit={handleJoin}>
              <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
                Step 2: Enter Room Invitation
              </h3>
              <div className="mb-6">
                <label className="block text-xs font-sans text-neutral-400 mb-1">Room ID (e.g. CRIC77)</label>
                <div className="relative">
                  <input
                    id="join-room-id-input"
                    type="text"
                    maxLength={10}
                    placeholder="CRIC77"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3 pl-10 pr-3 text-white uppercase focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono tracking-widest text-lg"
                    required
                  />
                  <Users className="absolute left-3.5 top-3.5 w-4 font-normal text-neutral-500" />
                </div>
              </div>

              <button
                id="submit-join-btn"
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transform active:scale-[0.98] transition shadow-lg"
              >
                <Gavel className="w-5 h-5" />
                Enter Auction Room
              </button>
            </form>
          )}

          {/* TAB: Create */}
          {activeTab === "create" && (
            <form onSubmit={handleCreate}>
              <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
                Step 2: Define Room Config
              </h3>
              
              <div className="mb-4">
                <label className="block text-xs font-sans text-neutral-400 mb-1">Auction Room Name</label>
                <input
                  id="create-room-name-input"
                  type="text"
                  maxLength={32}
                  placeholder="e.g. Mega Clash of Friends"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                  required
                />
              </div>

              {/* Game Mode Selector */}
              <div className="mb-5 bg-neutral-950 p-3.5 border border-neutral-850 rounded-xl">
                <label className="block text-xs font-mono tracking-wider text-amber-400 mb-2 uppercase">Select Game Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="mode-solo-btn"
                    type="button"
                    onClick={() => setIsSoloVsAI(true)}
                    className={`p-3 rounded-lg border text-left transition duration-200 ${
                      isSoloVsAI 
                        ? "bg-amber-500/10 border-amber-500 text-white" 
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      🤖 Player vs AI Mode
                    </div>
                    <p className="text-[10px] text-neutral-400 font-sans mt-1 leading-relaxed">
                      Instantly fills remaining slots with 9 computer-controlled franchises. Perfect for quick drafts!
                    </p>
                  </button>

                  <button
                    id="mode-multiplayer-btn"
                    type="button"
                    onClick={() => setIsSoloVsAI(false)}
                    className={`p-3 rounded-lg border text-left transition duration-200 ${
                      !isSoloVsAI 
                        ? "bg-amber-500/10 border-amber-500 text-white" 
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      👥 Multiplayer Mode
                    </div>
                    <p className="text-[10px] text-neutral-400 font-sans mt-1 leading-relaxed">
                      Generates a shareable Room Code. Friends can join, select franchises, and bid in real-time.
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-sans text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Starting Purse (₹ Crores)
                  </label>
                  <input
                    id="create-budget-input"
                    type="number"
                    min={50}
                    max={200}
                    value={budgetCr}
                    onChange={(e) => setBudgetCr(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                    required
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Real IPL budget is ₹100 Cr - ₹120 Cr.</p>
                </div>

                <div>
                  <label className="block text-xs font-sans text-neutral-400 mb-1 flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">⏱️</span>
                    Bid Timer Duration
                  </label>
                  <select
                    id="create-timer-select"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                  >
                    <option value={10}>10 Seconds (Fast/Action)</option>
                    <option value={15}>15 Seconds (Standard Play)</option>
                    <option value={20}>20 Seconds (Classic Tempo)</option>
                    <option value={30}>30 Seconds (Strategic Decision)</option>
                    <option value={45}>45 Seconds (Draft Expert)</option>
                    <option value={60}>60 Seconds (Analytical Master)</option>
                    <option value={90}>90 Seconds (Extremely Careful)</option>
                    <option value={120}>120 Seconds (High Stakes)</option>
                  </select>
                  <p className="text-[10px] text-neutral-500 mt-1">Resets with each placed bid.</p>
                </div>
              </div>

              <div className="mb-6 bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2">
                <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Settings className="w-3.5 h-3.5" />
                  Roster Guidelines:
                </div>
                <ul className="text-xs text-neutral-300 font-sans space-y-1.5 list-disc pl-4">
                  <li>Squad size must be between <span className="text-amber-400 font-bold">15 (minimum) and 25 (maximum)</span> players.</li>
                  <li>No limits on the number of individual categories (batters, bowlers, etc.) bought.</li>
                  <li>A maximum of <span className="text-amber-400 font-bold">8 Overseas</span> players are allowed per squad.</li>
                </ul>
              </div>

              <button
                id="submit-create-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transform active:scale-[0.98] transition shadow-lg py-3.5"
              >
                <Settings className="w-5 h-5" />
                Initialize Multi-User Arena Info
              </button>
            </form>
          )}

        </div>

        <div className="bg-neutral-950 p-4 border-t border-neutral-850 text-center">
          <p className="text-xs text-neutral-400 font-sans">
            Playing solo? Click <span className="text-amber-400 font-medium">Create New Room</span>, then turn on the <span className="text-amber-400 font-medium">✨ AI Challenger Bot</span> inside to compete with computer-controlled Goliaths.
          </p>
        </div>
      </div>
    </div>
  );
};
