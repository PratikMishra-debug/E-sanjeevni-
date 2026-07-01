<<<<<<< HEAD
# 🏥 E-Sanjeevni — Rural Telemedicine Platform

<div align="center">

### Bridging the Gap Between Rural Communities and Quality Healthcare

*A Full-Stack Telemedicine Solution Designed to Improve Healthcare Accessibility Through Technology*

</div>

---

## 📌 Overview

E-Sanjeevni is a full-stack telemedicine platform developed to address healthcare accessibility challenges faced by rural communities. The platform enables patients to connect with nearby dispensaries and qualified healthcare professionals without requiring long-distance travel.

The system aims to provide faster medical assistance, improve healthcare reach, and support emergency situations through integrated ambulance and notification services.

---

## 🎯 Problem Statement

Many rural regions face significant barriers to healthcare access, including:

* Limited availability of doctors
* Long travel distances to healthcare facilities
* Delayed medical consultations
* Lack of emergency response coordination
* Poor communication between patients and healthcare providers

E-Sanjeevni was built to reduce these challenges through a centralized digital healthcare platform.

---

## 🚀 Key Features

| Feature                        | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| 👨‍⚕️ Doctor Consultation      | Connect patients with qualified healthcare professionals |
| 🏥 Nearby Dispensary Access    | Locate and connect with nearby medical facilities        |
| 📱 SMS Notification System     | Send appointment and healthcare updates                  |
| 🚑 Emergency Ambulance Support | Quick emergency response assistance                      |
| 🔐 Secure Data Management      | Patient information handled securely                     |
| 📍 Rural Healthcare Focus      | Specifically designed for underserved communities        |
| 📲 Responsive Interface        | Accessible across multiple devices                       |

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose                    |
| ---------- | -------------------------- |
| React.js   | User Interface Development |
| HTML5      | Structure                  |
| CSS3       | Styling                    |
| JavaScript | Client-Side Logic          |

### Backend

| Technology | Purpose         |
| ---------- | --------------- |
| Node.js    | Server Runtime  |
| Express.js | API Development |

### Database

| Technology   | Purpose                   |
| ------------ | ------------------------- |
| SQL Database | Data Storage & Management |

---

## 🏗️ System Architecture

```text
Patient
   │
   ▼
React Frontend
   │
   ▼
Node.js + Express API
   │
   ▼
SQL Database
   │
   ▼
Doctors / Dispensaries / Emergency Services
```

---

## 🌟 Core Modules

### Patient Module

* Registration & Login
* Medical Assistance Requests
* Appointment Booking
* Emergency Support Requests

### Doctor Module

* Patient Consultation
* Medical Recommendations
* Appointment Management

### Healthcare Facility Module

* Dispensary Connectivity
* Service Management
* Patient Tracking

### Emergency Module

* Ambulance Request Handling
* Emergency Notifications
* Fast Response Coordination

---

## 📈 Impact

E-Sanjeevni aims to:

* Improve healthcare accessibility in rural regions
* Reduce delays in receiving medical advice
* Strengthen communication between patients and healthcare providers
* Support emergency healthcare response
* Promote technology-driven healthcare solutions

---

## 🔮 Future Enhancements

* AI-Based Symptom Analysis
* Real-Time Video Consultation
* Electronic Health Records (EHR)
* Medicine Recommendation System
* Multi-Language Support
* GPS-Based Ambulance Tracking
* Cloud Deployment & Scalability

---

## 👨‍💻 Developer

**Pratik Kumar**

* Full Stack Developer
* Software Engineering Enthusiast
* AI/ML Explorer

GitHub: https://github.com/PratikMishra-debug

LinkedIn: https://www.linkedin.com/in/pratik-kumar-a3a9bb332

---

## 📜 License

This project is developed for educational, innovation, and healthcare accessibility purposes.

=======
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

## Notes

- Ambulance number used throughout is India's real emergency number, **108**.
- All medicine, doctor, and dispensary data is static sample data in
  `ESanjeevni.jsx` — swap it for a real API/database when you're ready to go
  beyond a prototype.
- The chatbot's system prompt explicitly tells it never to give a definitive
  diagnosis and to always defer to a doctor or ambulance for anything
  serious — keep that guardrail if you extend it.
>>>>>>> 03dcde6 (fix vercel deployment)
