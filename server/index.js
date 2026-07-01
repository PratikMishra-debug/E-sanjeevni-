// Minimal backend proxy for the E-Sanjeevni chatbot.
//
// Why this exists: browsers can never be trusted with a secret API key, and
// the Anthropic API does not allow direct browser calls anyway (no CORS for
// client-side requests carrying a key). This tiny Express server sits
// between your React app and the Anthropic API, keeps ANTHROPIC_API_KEY on
// the server only, and forwards chat requests.
//
// Run it with:
//   cd server
//   npm install
//   cp .env.example .env   # then paste your key into .env
//   npm start

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      error:
        "ANTHROPIC_API_KEY is not set on the server. Add it to server/.env and restart.",
    });
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error("Anthropic API error:", err);
    res.status(500).json({ error: "Failed to reach Anthropic API" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`E-Sanjeevni chat proxy running on http://localhost:${PORT}`);
});
