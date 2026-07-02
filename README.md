# E-Sanjeevni — Rural Telemedicine Platform

A single-page React app for connecting rural North Indian patients to
doctors, ambulance dispatch, an online pharmacy, medicine reminders, and a
bilingual (Hindi/English) AI health assistant.

Built with **React + Vite + Tailwind CSS + lucide-react**. No external image
files are used — the doctor avatars, medicine capsule jar, and rural map are
all drawn in code (SVG/CSS), so there's nothing extra to download or host.

## Project structure

```
esanjeevni-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx          # React entry point
│   ├── index.css         # Tailwind directives
│   └── ESanjeevni.jsx    # The entire app (all components live here)
└── server/                # Small backend so the chatbot works outside claude.ai
    ├── index.js
    ├── package.json
    └── .env.example
```

## Running it locally

### 1. Frontend

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### 2. Chatbot backend (optional, but needed for the AI assistant to reply)

The floating "Ask AI" chat button calls `/api/chat`, which is proxied (see
`vite.config.js`) to a tiny Express server. This exists because a browser can
never safely hold a secret API key — the key has to live on a server.

```bash
cd server
npm install
cp .env.example .env
# open .env and paste in your Anthropic API key
npm start
```

The server runs on `http://localhost:8787`. With both the frontend (`npm run
dev` in the root) and this server running at the same time, the chatbot will
work end-to-end. If you skip this step, the rest of the app (doctors,
ambulance, pharmacy, reminders) still works fully — only the chatbot replies
will show a connection-error message.

Get an API key at https://console.anthropic.com/settings/keys.

## Building for production

```bash
npm run build
```

Outputs static files to `dist/`. Deploy `dist/` to any static host (Vercel,
Netlify, GitHub Pages, etc.), and deploy `server/` separately (Render,
Railway, Fly.io, a small VPS, etc.) — then point the frontend's `/api/chat`
calls at your deployed server's URL instead of the Vite dev proxy (e.g. by
setting a `VITE_API_URL` env var and using it in `ESanjeevni.jsx`).

## Pushing to GitHub

```bash
cd esanjeevni-app
git init
git add .
git commit -m "Initial commit: E-Sanjeevni telemedicine app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` and `node_modules` are already excluded via `.gitignore`, so your API
key will never be committed.

## Deploying to Vercel (recommended)

1. Push this folder to a GitHub repo (see "Pushing to GitHub" below).
2. On [vercel.com](https://vercel.com), **New Project → Import** your repo.
3. Vercel auto-detects Vite (the included `vercel.json` pins the build
   settings explicitly, so nothing to configure). **Root Directory** should
   be the folder that directly contains `package.json` (i.e. this folder —
   leave it blank if this is your repo root).
4. Before your first deploy, add an environment variable so the chatbot
   works: **Project Settings → Environment Variables** →
   `ANTHROPIC_API_KEY` = your key from
   https://console.anthropic.com/settings/keys → **Save**.
5. Click **Deploy**. The frontend builds via `npm run build` → `dist/`, and
   `api/chat.js` is automatically deployed as a Vercel Serverless Function
   that the chatbot calls at `/api/chat` — no separate backend needed.

If a deploy still fails, open the failed deployment's **Build Logs** and
scroll to the actual red error line (the panel only shows the last handful
of lines by default — click to expand/search). The most common causes are:
- **Root Directory** in Vercel project settings pointing at the wrong
  folder (should point at the folder with `package.json`, not a parent or
  child folder).
- A stale environment variable or cached build — try **Redeploy → Clear
  Cache and Redeploy**.
- Case-sensitive filename mismatches if the repo was first created on
  Windows/Mac (case-insensitive) and pushed from a machine that had the
  file cased differently — this repo's imports and filenames already match
  exactly (`src/ESanjeevni.jsx`), so re-cloning fresh from this zip avoids it.

## Notes

- Ambulance number used throughout is India's real emergency number, **108**.
- All medicine, doctor, and dispensary data is static sample data in
  `ESanjeevni.jsx` — swap it for a real API/database when you're ready to go
  beyond a prototype.
- The chatbot's system prompt explicitly tells it never to give a definitive
  diagnosis and to always defer to a doctor or ambulance for anything
  serious — keep that guardrail if you extend it.
