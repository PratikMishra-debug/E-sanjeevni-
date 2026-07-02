// Vercel Serverless Function: POST /api/chat
//
// This lets the chatbot work on Vercel with zero extra infrastructure.
// Set ANTHROPIC_API_KEY in your Vercel project's Environment Variables
// (Project Settings -> Environment Variables), then redeploy.
//
// Local dev still uses server/index.js via the Vite proxy in vite.config.js
// (or you can run `vercel dev` instead, which will use this file too).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({
      error:
        "ANTHROPIC_API_KEY is not set. Add it in Vercel: Project Settings -> Environment Variables, then redeploy.",
    });
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const { system, messages } = body || {};
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
    return res.status(200).json(data);
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json({ error: "Failed to reach Anthropic API" });
  }
}
