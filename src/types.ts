/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PlayerCategory {
  BAT = "BAT",       // Batsman
  BOWL = "BOWL",     // Bowler
  AR = "AR",         // All-Rounder
  WK = "WK"          // Wicket-Keeper
}

export interface PlayerStats {
  matches: number;
  // Batsman/WK stats
  runs?: number;
  strikeRate?: number;
  average?: number;
  hundreds?: number;
  fifties?: number;
  // Bowler stats
  wickets?: number;
  economy?: number;
  bestBowling?: string;
}

export interface IPLPlayer {
  id: string;
  name: string;
  category: PlayerCategory;
  basePriceLakhs: number; // e.g. 200 = 2.00 Crore
  country: "Indian" | "Overseas";
  teamAssociation: string; // Real-world context
  stats: PlayerStats;
  avatarUrl?: string;
  customValuationScore?: number; // Client calculated based on custom weight parameters
  setId?: string;
}

export interface MemberSlots {
  BAT: string[];  // Player IDs
  BOWL: string[]; // Player IDs
  AR: string[];   // Player IDs
  WK: string[];   // Player IDs
}

export interface RosterConfig {
  BAT: number;  // Required count
  BOWL: number;
  AR: number;
  WK: number;
}

export interface FranchiseMember {
  uid: string;
  name: string;          // User nickname
  franchiseName: string; // MI, CSK, etc.
  budgetLakhs: number;   // Purse remaining
  slots: MemberSlots;
  isHost: boolean;
  isActive: boolean;
}

export interface AuctionRoom {
  id: string;
  name: string;
  hostId: string;
  status: "lobby" | "bidding" | "paused" | "finished" | "intermission";
  currentBidLakhs: number;
  currentBidderId: string | null;
  currentBidderName: string | null;
  currentPlayerId: string | null;
  timerDurationSeconds: number;
  timerExpiresAt: number | null; // Milliseconds timestamp
  intermissionExpiresAt?: number | null; // Milliseconds timestamp
  budgetLimitLakhs: number;     // e.g. 10000 = 100 Crore
  slotsConfig: RosterConfig;
  members: Record<string, FranchiseMember>;
  currentPlayerIndex: number;
  playerPoolIds: string[];
  createdAt: string;
  gameMode?: "solo" | "multiplayer";
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export enum LogType {
  BID = "bid",
  SOLD = "sold",
  UNSOLD = "unsold",
  JOIN = "join",
  LEAVE = "leave",
  PAUSE = "pause",
  RESUME = "resume",
  SYSTEM = "system"
}

export interface DraftLog {
  id: string;
  type: LogType;
  message: string;
  playerId?: string;
  playerName?: string;
  amountLakhs?: number;
  buyerId?: string;
  buyerName?: string;
  createdAt: string;
}

// WebRTC Signaling formats
export interface SignalingPacket {
  id: string;
  senderId: string;
  targetId: string;
  type: "offer" | "answer" | "candidate";
  payload: string; // JSON Stringified RTCSessionDescriptionInit or RTCIceCandidateInit
  createdAt: string;
}

// AI Valuation parameters
export interface AnalyticsWeights {
  runsWeight: number;       // 0-100
  strikeRateWeight: number; // 0-100
  wicketsWeight: number;    // 0-100
  economyWeight: number;    // 0-100 (inverse)
  experienceWeight: number; // 0-100
}

export interface AIAnalysisResponse {
  valuationLakhs: number;
  ratingGrade: "A+" | "A" | "B+" | "B" | "C+" | "C";
  strategicAdvice: string;
  synergyAnalysis: string;
}
