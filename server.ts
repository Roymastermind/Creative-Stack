/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Lazy initialization of Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Server-Side Gemini Player Valuation & Strategy Coach
app.post("/api/gemini-valuation", async (req, res) => {
  try {
    const { player, userRoster, budgetLakhs, weights, slotsConfig } = req.body;

    if (!player) {
      res.status(400).json({ error: "Missing player data for analysis" });
      return;
    }

    // Construct safe structured prompt for Gemini 2.5 Flash
    const prompt = `
You are an expert Indian Premier League (IPL) Auction Mastermind, scout, and analytical strategist.
Provide a highly customized analytical evaluation for bidding on this player based on the current situation.

CURRENT SITUATION:
- Player under auction: ${player.name} (${player.category})
  - Base Price: ₹${(player.basePriceLakhs / 100).toFixed(2)} Crore (${player.basePriceLakhs} Lakhs)
  - Nationality: ${player.country}
  - Real-world Team: ${player.teamAssociation}
  - Stats: ${JSON.stringify(player.stats)}
- My Franchise Current Purse Remaining: ₹${(budgetLakhs / 100).toFixed(2)} Crore (${budgetLakhs} Lakhs)
- Required Slots Config: ${JSON.stringify(slotsConfig)}
- My Current Roster (Filled categories): ${JSON.stringify(userRoster)}
- Strategic Analytical Priority Weights (0 to 100):
  - Weight for Runs: ${weights.runsWeight}
  - Weight for Strike Rate: ${weights.strikeRateWeight}
  - Weight for Wickets: ${weights.wicketsWeight}
  - Weight for Economy Rate: ${weights.economyWeight}
  - Weight for Matches (Experience): ${weights.experienceWeight}

GOALS:
- Evaluate the player's fair, customized "analytical market value" in Lakhs (IPL Rupees).
  - Note: Minimum value must be their basePriceLakhs. Max value shouldn't exceed outstanding budget, typically and realistically between base price and e.g., 2000 Lakhs (₹20 Cr) for superstar players.
  - Return a numeric value for "valuationLakhs".
- Provide a squad 'ratingGrade' of either "A+", "A", "B+", "B", "C+", or "C" for this signing's suitability.
- Write professional, crisp "strategicAdvice" (2-3 sentences) on bidding strategy (e.g. walk away point, bidding incremental pacing, wait-and-buy).
- Write a highly technical "synergyAnalysis" (2-3 sentences) describing how this player complements the franchise's empty slots, bowling economy needs, or power-hitting striker requirements.

OUTPUT FORMAT (You MUST return strictly valid JSON matching this exact typescript structure):
{
  "valuationLakhs": number,
  "ratingGrade": "A+" | "A" | "B+" | "B" | "C+" | "C",
  "strategicAdvice": "string advice content",
  "synergyAnalysis": "string synergy content"
}

Do NOT include any extra explanations or markdown wrapper outside of the JSON block. Return purely the valid JSON.
`;

    const ai = getGenAI();
    const modelName = "gemini-2.5-flash"; // Recommended high-speed capabilities model

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [prompt],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Lower temperature for structured accuracy
      },
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("Empty response from Gemini AI");
    }

    const cleanedText = bodyText.trim();
    const resultJson = JSON.parse(cleanedText);

    res.json(resultJson);
  } catch (error) {
    console.error("Gemini valuation proxy error:", error);
    // Graceful fallback values in case GEMINI_API_KEY is not configured or fails
    const fallbackValuation = req.body?.player?.basePriceLakhs 
      ? Math.round(req.body.player.basePriceLakhs * 1.4) 
      : 300;
      
    res.json({
      valuationLakhs: fallbackValuation,
      ratingGrade: "A",
      strategicAdvice: "AI valuation is acting in fallback mode. Ensure GEMINI_API_KEY is saved in standard Secrets. Bidding recommendation is to proceed incrementally up to 1.5x of player's base price.",
      synergyAnalysis: "Analytical synergy suggests the player fits standard team composition profiles, balancing current cricket statistics alongside your available budget purse.",
      isFallback: true
    });
  }
});

// Configure Vite middleware in development or static fallback in production
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[IPL Auction Engine] Server operational on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Server bootstrapping failed:", err);
});
