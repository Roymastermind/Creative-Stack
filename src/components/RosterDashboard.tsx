/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coins, UserCheck, ShieldClose, Grid, Users } from "lucide-react";
import { AuctionRoom, FranchiseMember, PlayerCategory } from "../types";
import { getPlayerById } from "../data/players";

interface RosterDashboardProps {
  room: AuctionRoom;
  activeMemberId: string;
}

export const RosterDashboard: React.FC<RosterDashboardProps> = ({ room, activeMemberId }) => {
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>(activeMemberId);
  const selectedMember: FranchiseMember | undefined = room.members[selectedFranchiseId];

  if (!selectedMember || !selectedMember.franchiseName) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-center text-neutral-400 font-sans">
        Pick a franchise team above to unlock your roster ledger and participate! Or select any active opponent coach to review their squad sheets.
      </div>
    );
  }

  // Calculate metrics
  const slotsObj = selectedMember.slots || { BAT: [], BOWL: [], AR: [], WK: [] };
  const purchasedBatters = slotsObj.BAT || [];
  const purchasedBowlers = slotsObj.BOWL || [];
  const purchasedAR = slotsObj.AR || [];
  const purchasedWK = slotsObj.WK || [];
  
  const totalPlayersBought = purchasedBatters.length + purchasedBowlers.length + purchasedAR.length + purchasedWK.length;

  let overseasCount = 0;
  Object.values(slotsObj).forEach((playerList) => {
    if (!playerList) return;
    playerList.forEach((pId) => {
      const p = getPlayerById(pId);
      if (p && p.country === "Overseas") {
        overseasCount++;
      }
    });
  });

  // Helper to render squad slots for a specific category
  const renderCategorySlots = (category: PlayerCategory) => {
    const filledPlayerIds = slotsObj[category] || [];
    
    if (filledPlayerIds.length === 0) {
      return (
        <div className="flex items-center gap-1.5 p-2 mb-1.5 border border-dashed border-neutral-800 rounded-lg text-neutral-600 bg-neutral-900/30 text-[10px] font-mono h-9">
          No {category} bought yet
        </div>
      );
    }

    return filledPlayerIds.map((playerId, i) => {
      const player = getPlayerById(playerId);
      if (!player) return null;
      return (
        <div 
          key={`${category}-slot-${playerId}-${i}`}
          className="flex items-center justify-between p-2 mb-1.5 bg-neutral-950 border border-neutral-850 hover:border-amber-500/50 rounded-lg transition"
        >
          <div>
            <div className="text-xs font-semibold text-neutral-200 truncate max-w-[120px]">
              {player.name}
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              {player.country === "Overseas" ? "✈️ Overseas" : "🇮🇳 Indian"} • {player.teamAssociation}
            </div>
          </div>
          <div className="text-xs text-amber-400 font-semibold font-mono">
            ₹{(player.basePriceLakhs / 100).toFixed(2)} Cr
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col h-full">
      {/* Franchise Selector tabs */}
      <div className="mb-4">
        <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase mb-2">
          Select Franchise Ledger
        </label>
        <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 pb-1">
          {(Object.values(room.members) as FranchiseMember[]).map((member) => (
            <button
              key={member.uid}
              id={`select-franchise-${member.uid}`}
              onClick={() => setSelectedFranchiseId(member.uid)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
                selectedFranchiseId === member.uid
                  ? "bg-amber-400 text-black border-amber-300 shadow-md"
                  : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <span className="text-base">
                {member.uid === activeMemberId ? "⭐" : "🏏"}
              </span>
              <span>{member.franchiseName || "Unassigned"} ({member.name})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Roster Header Stats */}
      <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center items-center">
        <div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Purse Left</div>
          <div className="text-base font-bold text-amber-400 font-mono flex items-center justify-center gap-1 mt-0.5">
            <Coins className="w-4 h-4 text-amber-500" />
            ₹{(selectedMember.budgetLakhs / 100).toFixed(2)} Cr
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Squad Strength</div>
          <div className="text-base font-bold text-white font-mono flex items-center justify-center gap-1 mt-0.5">
            <Grid className="w-4 h-4 text-emerald-500" />
            <span>{totalPlayersBought} / 25</span>
          </div>
          <span className={`text-[9px] font-semibold px-1 rounded-sm ${totalPlayersBought < 15 ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
            {totalPlayersBought < 15 ? `Needs ${15 - totalPlayersBought} more` : 'Filled min 15'}
          </span>
        </div>

        <div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Overseas Slots</div>
          <div className="text-base font-bold text-white font-mono flex items-center justify-center gap-1 mt-0.5">
            <Users className="w-4 h-4 text-cyan-500" />
            <span>{overseasCount} / 8</span>
          </div>
          <span className={`text-[9px] font-semibold px-1 rounded-sm ${overseasCount === 8 ? 'text-red-400 bg-red-400/10' : 'text-cyan-400 bg-cyan-400/10'}`}>
            Max 8 allowed
          </span>
        </div>

        <div className="flex items-center justify-center text-xs text-neutral-400 font-sans md:border-l border-neutral-800 h-full">
          {selectedMember.uid === activeMemberId ? (
            <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full text-[10px] font-mono border border-amber-500/20">
              <UserCheck className="w-3.5 h-3.5" /> MY FRANCHISE
            </span>
          ) : (
            <span className="text-neutral-500 flex items-center gap-1 bg-neutral-950 px-2.5 py-1 rounded-full text-[10px] font-mono border border-neutral-850 animate-pulse">
              <ShieldClose className="w-3.5 h-3.5" /> OPPONENT TEAM
            </span>
          )}
        </div>
      </div>

      {/* Slots details Grid */}
      <div id="roster-slots-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 overflow-y-auto flex-1 max-h-[360px] lg:max-h-full pr-1">
        {/* Batsmen */}
        <div className="bg-neutral-950/40 p-2.5 border border-neutral-850 rounded-lg">
          <div className="text-[10px] font-mono text-teal-300 border-b border-neutral-800 pb-1 mb-2 flex justify-between uppercase">
            <span>🏏 Batsmen</span>
            <span>{purchasedBatters.length}</span>
          </div>
          <div className="space-y-1.5">{renderCategorySlots(PlayerCategory.BAT)}</div>
        </div>

        {/* Bowlers */}
        <div className="bg-neutral-950/40 p-2.5 border border-neutral-850 rounded-lg">
          <div className="text-[10px] font-mono text-cyan-300 border-b border-neutral-800 pb-1 mb-2 flex justify-between uppercase">
            <span>🥎 Bowlers</span>
            <span>{purchasedBowlers.length}</span>
          </div>
          <div className="space-y-1.5">{renderCategorySlots(PlayerCategory.BOWL)}</div>
        </div>

        {/* All-rounders */}
        <div className="bg-neutral-950/40 p-2.5 border border-neutral-850 rounded-lg">
          <div className="text-[10px] font-mono text-yellow-300 border-b border-neutral-800 pb-1 mb-2 flex justify-between uppercase">
            <span>⚡ All-Rounders</span>
            <span>{purchasedAR.length}</span>
          </div>
          <div className="space-y-1.5">{renderCategorySlots(PlayerCategory.AR)}</div>
        </div>

        {/* Wicketkeepers */}
        <div className="bg-neutral-950/40 p-2.5 border border-neutral-850 rounded-lg">
          <div className="text-[10px] font-mono text-pink-300 border-b border-neutral-800 pb-1 mb-2 flex justify-between uppercase">
            <span>🧤 Keepers</span>
            <span>{purchasedWK.length}</span>
          </div>
          <div className="space-y-1.5">{renderCategorySlots(PlayerCategory.WK)}</div>
        </div>
      </div>
    </div>
  );
};
