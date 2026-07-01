import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Stethoscope, Ambulance, Pill, Bell, MessageCircle, Send, X, Phone,
  MapPin, Clock, Star, ShoppingCart, Plus, Minus, Trash2, CheckCircle2,
  Languages, User, Home, Navigation, AlertTriangle, CreditCard, Wallet,
  Banknote, Loader2, ChevronRight, Volume2, Calendar, Menu, ShieldCheck,
  Building2, Siren, PhoneCall,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Anjali Sharma",
    qualification: "MBBS, MD (General Medicine)",
    specialty: "General Physician",
    experience: 12,
    languages: ["Hindi", "English"],
    rating: 4.8,
    fee: 199,
    available: true,
    color: "#0F7A4C",
  },
  {
    id: 2,
    name: "Dr. Rajeev Chauhan",
    qualification: "MBBS, DCH",
    specialty: "Child Specialist (Pediatrician)",
    experience: 9,
    languages: ["Hindi", "English", "Haryanvi"],
    rating: 4.6,
    fee: 149,
    available: true,
    color: "#0E6B8F",
  },
  {
    id: 3,
    name: "Dr. Sunita Yadav",
    qualification: "BAMS, MD (Ayurveda)",
    specialty: "Ayurvedic Medicine",
    experience: 15,
    languages: ["Hindi"],
    rating: 4.9,
    fee: 99,
    available: false,
    color: "#8A6D1E",
  },
  {
    id: 4,
    name: "Dr. Karan Mehta",
    qualification: "MBBS, MS (Orthopedics)",
    specialty: "Bone & Joint Specialist",
    experience: 8,
    languages: ["Hindi", "English"],
    rating: 4.5,
    fee: 249,
    available: true,
    color: "#6B3FA0",
  },
  {
    id: 5,
    name: "Dr. Meena Kumari",
    qualification: "MBBS, DGO",
    specialty: "Gynecologist",
    experience: 14,
    languages: ["Hindi", "English"],
    rating: 4.9,
    fee: 199,
    available: true,
    color: "#B0473F",
  },
  {
    id: 6,
    name: "Dr. Farhan Ali",
    qualification: "BDS, MDS",
    specialty: "Dentist",
    experience: 6,
    languages: ["Hindi", "English", "Urdu"],
    rating: 4.4,
    fee: 149,
    available: true,
    color: "#1E7A6B",
  },
];

const MEDICINES = [
  { id: 1, name: "Paracetamol 500mg", desc: "Fever & pain relief · Strip of 10", price: 25, category: "Fever" },
  { id: 2, name: "ORS Powder", desc: "Oral rehydration salts · Pack of 5", price: 40, category: "Hydration" },
  { id: 3, name: "Amoxicillin 250mg", desc: "Antibiotic · Strip of 10 (Rx)", price: 65, category: "Antibiotic" },
  { id: 4, name: "Cetirizine 10mg", desc: "Allergy relief · Strip of 10", price: 20, category: "Allergy" },
  { id: 5, name: "Iron & Folic Acid", desc: "Anemia support · Bottle of 30", price: 55, category: "Supplement" },
  { id: 6, name: "Cough Syrup", desc: "Dry & wet cough · 100ml", price: 85, category: "Cough & Cold" },
  { id: 7, name: "Multivitamin Tablets", desc: "Daily vitality · Bottle of 30", price: 120, category: "Supplement" },
  { id: 8, name: "Diabetes Test Strips", desc: "Blood glucose monitoring · 25 strips", price: 350, category: "Diagnostics" },
];

// Approx real coordinates around Baghpat / Meerut district, Uttar Pradesh (North India)
// used to build a stylised map and real "get directions" links.
const VILLAGES = [
  { id: "v1", name: "Rampur Kalan", x: 90, y: 260, lat: 28.965, lng: 77.612 },
  { id: "v2", name: "Sultanpur Kalan", x: 210, y: 150, lat: 29.02, lng: 77.66 },
  { id: "v3", name: "Nangla Devi", x: 300, y: 310, lat: 28.94, lng: 77.7 },
  { id: "v4", name: "Haiderpur", x: 140, y: 90, lat: 29.05, lng: 77.58 },
];

const DISPENSARIES = [
  { id: "d1", name: "Primary Health Centre, Baraut", distance: "3.2 km", phone: "+911233123456", lat: 29.0995, lng: 77.2597 },
  { id: "d2", name: "Community Health Centre, Baghpat", distance: "7.8 km", phone: "+911234567890", lat: 28.9448, lng: 77.2183 },
  { id: "d3", name: "Sub-Centre, Chhaprauli", distance: "5.1 km", phone: "+911234123499", lat: 29.1372, lng: 77.325 },
];

const HOSPITAL = { name: "District Civil Hospital, Baghpat", x: 350, y: 90, lat: 28.9448, lng: 77.2183 };

const HEALTH_TIPS = [
  { hi: "रोज़ 8 गिलास पानी पिएं।", en: "Drink 8 glasses of water daily." },
  { hi: "दवा समय पर लें, खुराक न छोड़ें।", en: "Take medicines on time, never skip a dose." },
  { hi: "हाथ धोना बीमारियों से बचाता है।", en: "Regular handwashing prevents many illnesses." },
  { hi: "बुखार 2 दिन से ज़्यादा हो तो डॉक्टर से मिलें।", en: "See a doctor if fever lasts more than 2 days." },
];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const inr = (n) => `\u20b9${n}`;

function mapsLink(lat, lng, label) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}(${encodeURIComponent(label)})`;
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, tone = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return { toasts, push };
}

/* ------------------------------------------------------------------ */
/* Toast stack                                                         */
/* ------------------------------------------------------------------ */

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] flex flex-col gap-2 w-[92%] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-xl px-4 py-3 shadow-lg text-sm font-medium flex items-start gap-2 animate-toast-in ${
            t.tone === "error"
              ? "bg-red-600 text-white"
              : t.tone === "warn"
              ? "bg-amber-500 text-white"
              : "bg-[#0F7A4C] text-white"
          }`}
        >
          {t.tone === "error" ? <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

function Navbar({ tab, setTab, cartCount, onSOS, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const items = [
    { id: "home", label: lang === "hi" ? "होम" : "Home", icon: Home },
    { id: "doctors", label: lang === "hi" ? "डॉक्टर" : "Doctors", icon: Stethoscope },
    { id: "ambulance", label: lang === "hi" ? "एम्बुलेंस" : "Ambulance", icon: Ambulance },
    { id: "pharmacy", label: lang === "hi" ? "दवा" : "Pharmacy", icon: Pill },
    { id: "reminders", label: lang === "hi" ? "रिमाइंडर" : "Reminders", icon: Bell },
  ];

  const go = (id) => {
    setTab(id);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <button onClick={() => go("home")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#0F7A4C] flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-[#0B4A30] tracking-tight">E-Sanjeevni</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = tab === it.id;
            return (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  active ? "bg-emerald-50 text-[#0B4A30]" : "text-gray-600 hover:bg-emerald-50/60"
                }`}
              >
                <Icon size={16} />
                {it.label}
                {it.id === "pharmacy" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 text-[#0B4A30] hover:bg-emerald-50"
          >
            <Languages size={14} />
            {lang === "hi" ? "EN" : "हिं"}
          </button>
          <button
            onClick={onSOS}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg animate-pulse-slow"
          >
            <Siren size={16} />
            <span className="hidden sm:inline">{lang === "hi" ? "एसओएस" : "SOS"}</span>
          </button>
          <button className="md:hidden text-[#0B4A30]" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-emerald-100 px-4 py-2 flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50/60"
              >
                <Icon size={17} /> {it.label}
              </button>
            );
          })}
          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50/60"
          >
            <Languages size={17} /> {lang === "hi" ? "Switch to English" : "हिंदी में बदलें"}
          </button>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Home / Dashboard                                                     */
/* ------------------------------------------------------------------ */

function Medicine3D() {
  const capsuleColors = ["#BFF0D2", "#7FDBA6", "#3FAE6B", "#1F7A4C", "#0F5C39"];
  const capsules = [];
  let idx = 0;
  for (let row = 0; row < 10; row++) {
    const y = 58 + row * 15.5;
    const stagger = row % 2 === 0 ? 0 : 10;
    for (let col = 0; col < 6; col++) {
      const x = 46 + stagger + col * 19;
      if (x > 148) continue;
      const seed = Math.sin(idx * 12.9898) * 43758.5453;
      const frac = seed - Math.floor(seed);
      const rot = (frac - 0.5) * 34;
      const color = capsuleColors[idx % capsuleColors.length];
      capsules.push({ x, y, rot, color, key: idx });
      idx++;
    }
  }

  return (
    <div className="relative w-full max-w-xs mx-auto h-80 sm:h-96">
      {/* ambient glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-3xl scale-90" />
      {/* ground shadow */}
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-40 h-6 rounded-full bg-[#0B4A30]/25 blur-md med3d-shadow" />

      {/* a few loose capsules floating outside the jar */}
      <div className="absolute top-4 left-2 w-9 h-4 rounded-full bg-gradient-to-r from-emerald-200 to-emerald-500 shadow-lg med3d-capsule-a" />
      <div className="absolute top-16 right-0 w-7 h-3.5 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-400 shadow-lg med3d-capsule-b" />
      <div className="absolute bottom-14 left-0 w-8 h-4 rounded-full bg-gradient-to-r from-emerald-200 to-emerald-500 shadow-lg med3d-capsule-c" />

      <div className="absolute inset-0 flex items-center justify-center med3d-float">
        <div className="med3d-wobble drop-shadow-2xl">
          <svg width="190" height="270" viewBox="0 0 200 280">
            <defs>
              <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFDF6" />
                <stop offset="100%" stopColor="#E7DFC8" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
                <stop offset="12%" stopColor="#FFFFFF" stopOpacity="0.06" />
                <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
              </linearGradient>
              <clipPath id="jarClip">
                <rect x="44" y="50" width="112" height="190" rx="22" />
              </clipPath>
            </defs>

            {/* cap */}
            <rect x="70" y="8" width="60" height="26" rx="6" fill="url(#capGrad)" stroke="#C9BE9E" strokeWidth="1.5" />
            <rect x="70" y="16" width="60" height="3" fill="#C9BE9E" opacity="0.6" />
            <rect x="70" y="23" width="60" height="3" fill="#C9BE9E" opacity="0.6" />
            <rect x="76" y="32" width="48" height="12" rx="3" fill="#DED2AE" />

            {/* jar body outline */}
            <rect x="40" y="46" width="120" height="200" rx="26" fill="#0B4A30" opacity="0.06" />

            {/* capsules packed inside, clipped to jar shape */}
            <g clipPath="url(#jarClip)">
              <rect x="40" y="46" width="120" height="200" fill="#EAF6EE" />
              {capsules.map((c) => (
                <rect
                  key={c.key}
                  x={c.x - 9}
                  y={c.y - 4}
                  width="18"
                  height="8"
                  rx="4"
                  fill={c.color}
                  transform={`rotate(${c.rot} ${c.x} ${c.y})`}
                />
              ))}
            </g>

            {/* jar glass outline + shine */}
            <rect x="40" y="46" width="120" height="200" rx="26" fill="none" stroke="#0B4A30" strokeOpacity="0.25" strokeWidth="2.5" />
            <rect x="40" y="46" width="120" height="200" rx="26" fill="url(#glassGrad)" />

            {/* label band */}
            <rect x="46" y="128" width="108" height="46" rx="8" fill="#0F7A4C" />
            <g fontFamily="Inter, sans-serif" textAnchor="middle">
              <text x="100" y="148" fontSize="13" fontWeight="700" fill="#ffffff">E-Sanjeevni</text>
              <text x="100" y="163" fontSize="8" fontWeight="600" fill="#BFE3CC" letterSpacing="1.5">RURAL CARE</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setTab, lang, onSOS }) {
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % HEALTH_TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const actions = [
    { id: "doctors", icon: Stethoscope, title: lang === "hi" ? "डॉक्टर से बात करें" : "Talk to a Doctor", desc: lang === "hi" ? "वीडियो पर मुफ़्त सलाह" : "Free video consultation", color: "#0F7A4C" },
    { id: "ambulance", icon: Ambulance, title: lang === "hi" ? "एम्बुलेंस बुलाएं" : "Call Ambulance", desc: lang === "hi" ? "आपातकालीन सहायता" : "Emergency response", color: "#C0392B" },
    { id: "pharmacy", icon: Pill, title: lang === "hi" ? "दवा ऑर्डर करें" : "Order Medicine", desc: lang === "hi" ? "घर तक डिलीवरी" : "Delivered to your door", color: "#1E6B8F" },
    { id: "reminders", icon: Bell, title: lang === "hi" ? "रिमाइंडर सेट करें" : "Set Reminder", desc: lang === "hi" ? "दवा का समय न भूलें" : "Never miss a dose", color: "#8A6D1E" },
  ];

  return (
    <div>
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(circle at 85% 10%, rgba(244,197,66,0.35) 0%, transparent 45%), radial-gradient(circle at 15% 90%, rgba(31,164,103,0.45) 0%, transparent 55%), linear-gradient(160deg, #06301E 0%, #0B4A30 45%, #147A4C 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-[#1FA467]/30 blur-3xl" />
        <div className="absolute -top-16 right-0 w-80 h-80 rounded-full bg-[#F4C542]/25 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <MapPin size={12} /> {lang === "hi" ? "उत्तर भारत, ग्रामीण सेवा" : "North India · Rural Healthcare Network"}
            </div>
            <h1 className="font-bold text-3xl sm:text-5xl leading-tight tracking-tight mb-4">
              {lang === "hi" ? "स्वास्थ्य सेवा, अब हर गाँव तक" : "Healthcare, now within reach of every village"}
            </h1>
            <p className="text-emerald-50/90 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base mb-8">
              {lang === "hi"
                ? "डॉक्टर से बात करें, एम्बुलेंस बुलाएं, दवा मंगवाएं — सब एक ही जगह पर।"
                : "Talk to a doctor, call an ambulance, order medicine — all from one place."}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button onClick={() => setTab("doctors")} className="bg-white text-[#0B4A30] font-semibold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                <Stethoscope size={18} /> {lang === "hi" ? "अभी परामर्श लें" : "Consult Now"}
              </button>
              <button onClick={onSOS} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-colors">
                <Siren size={18} /> {lang === "hi" ? "आपातकाल" : "Emergency SOS"}
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 sm:gap-14 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold">+14K</div>
                <div className="text-emerald-100/80 text-xs sm:text-sm">{lang === "hi" ? "मरीज़ों की मदद" : "Patients helped"}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">6</div>
                <div className="text-emerald-100/80 text-xs sm:text-sm">{lang === "hi" ? "विशेषज्ञ डॉक्टर" : "Specialist doctors"}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">24/7</div>
                <div className="text-emerald-100/80 text-xs sm:text-sm">{lang === "hi" ? "एम्बुलेंस सेवा" : "Ambulance service"}</div>
              </div>
            </div>
          </div>

          <div className="order-first lg:order-last -mb-4 lg:mb-0">
            <Medicine3D />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 -mt-8 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => setTab(a.id)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 sm:p-5 text-left border border-emerald-100"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${a.color}1A` }}>
                <Icon size={20} style={{ color: a.color }} />
              </div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">{a.title}</div>
              <div className="text-gray-500 text-xs sm:text-sm mt-0.5">{a.desc}</div>
            </button>
          );
        })}
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-2xl p-6 sm:p-8 border border-emerald-100">
          <div className="flex items-center gap-2 text-[#0B4A30] font-semibold mb-3">
            <Volume2 size={18} /> {lang === "hi" ? "आज की स्वास्थ्य सलाह" : "Today's health tip"}
          </div>
          <p key={tipIdx} className="text-gray-700 text-base sm:text-lg animate-fade-in">
            {lang === "hi" ? HEALTH_TIPS[tipIdx].hi : HEALTH_TIPS[tipIdx].en}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100">
          <div className="flex items-center gap-2 text-[#0B4A30] font-semibold mb-4">
            <Building2 size={18} /> {lang === "hi" ? "पास के डिस्पेंसरी" : "Nearby dispensaries"}
          </div>
          <div className="flex flex-col gap-3">
            {DISPENSARIES.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.distance} {lang === "hi" ? "दूर" : "away"}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`tel:${d.phone}`} className="p-2 rounded-lg bg-emerald-50 text-[#0F7A4C] hover:bg-emerald-100">
                    <Phone size={15} />
                  </a>
                  <a href={mapsLink(d.lat, d.lng, d.name)} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-emerald-50 text-[#0F7A4C] hover:bg-emerald-100">
                    <Navigation size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctors                                                              */
/* ------------------------------------------------------------------ */

function BookingModal({ doctor, lang, onClose, push }) {
  const [stage, setStage] = useState("confirm"); // confirm -> connecting -> connected
  useEffect(() => {
    if (stage === "connecting") {
      const t = setTimeout(() => {
        setStage("connected");
        push(lang === "hi" ? `${doctor.name} से जुड़ गए!` : `Connected with ${doctor.name}!`);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

        {stage === "confirm" && (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${doctor.color}22` }}>
              <User size={26} style={{ color: doctor.color }} />
            </div>
            <h3 className="text-center font-semibold text-lg text-gray-900">{doctor.name}</h3>
            <p className="text-center text-sm text-gray-500 mb-4">{doctor.specialty}</p>
            <div className="bg-emerald-50/60 rounded-xl p-3 text-sm text-gray-600 mb-5 flex items-center justify-between">
              <span>{lang === "hi" ? "परामर्श शुल्क" : "Consultation fee"}</span>
              <span className="font-semibold text-gray-900">{inr(doctor.fee)}</span>
            </div>
            <button
              onClick={() => setStage("connecting")}
              className="w-full bg-[#0F7A4C] hover:bg-[#0B4A30] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <PhoneCall size={17} /> {lang === "hi" ? "वीडियो कॉल शुरू करें" : "Start Video Consultation"}
            </button>
          </>
        )}

        {stage === "connecting" && (
          <div className="py-8 flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#0F7A4C]" />
            <p className="text-gray-600 text-sm">{lang === "hi" ? "डॉक्टर से जोड़ा जा रहा है..." : "Connecting you to the doctor..."}</p>
          </div>
        )}

        {stage === "connected" && (
          <div className="py-6 flex flex-col items-center gap-3">
            <CheckCircle2 size={40} className="text-[#0F7A4C]" />
            <p className="text-gray-800 font-medium text-center">
              {lang === "hi" ? "आप जुड़ गए हैं" : "You're connected"}
            </p>
            <p className="text-gray-500 text-sm text-center">
              {lang === "hi" ? `${doctor.name} जल्द ही आपसे बात करेंगे।` : `${doctor.name} will speak with you shortly.`}
            </p>
            <button onClick={onClose} className="mt-2 text-sm font-medium text-[#0F7A4C] underline">
              {lang === "hi" ? "बंद करें" : "Close"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorProfileModal({ doctor, lang, onClose, onBook }) {
  const timings = ["09:00 – 13:00", "16:00 – 20:00"];
  const about =
    lang === "hi"
      ? `${doctor.name} को ${doctor.specialty} में ${doctor.experience} वर्षों का अनुभव है। वे ग्रामीण उत्तर भारत के मरीज़ों को सरल और स्पष्ट सलाह देने के लिए जाने जाते हैं।`
      : `${doctor.name} brings ${doctor.experience} years of dedicated experience in ${doctor.specialty}, known for clear, patient-friendly guidance for rural North Indian communities.`;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[88vh] overflow-y-auto p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${doctor.color}22` }}
          >
            <User size={30} style={{ color: doctor.color }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate">{doctor.name}</h3>
            <div className="text-sm font-medium" style={{ color: doctor.color }}>{doctor.specialty}</div>
            <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
              <Star size={12} className="fill-amber-400 text-amber-400" /> {doctor.rating}
              <span className="text-gray-400">· {doctor.experience} {lang === "hi" ? "वर्ष अनुभव" : "yrs exp"}</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-3.5 mb-4">
          <div className="text-xs font-semibold text-gray-500 mb-1">{lang === "hi" ? "योग्यता" : "Qualifications"}</div>
          <div className="text-sm font-medium text-gray-800">{doctor.qualification}</div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">{about}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-emerald-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B4A30] mb-1">
              <Clock size={12} /> {lang === "hi" ? "समय" : "Available"}
            </div>
            {timings.map((t) => (
              <div key={t} className="text-xs text-gray-600">{t}</div>
            ))}
          </div>
          <div className="bg-emerald-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B4A30] mb-1">
              <Languages size={12} /> {lang === "hi" ? "भाषाएं" : "Languages"}
            </div>
            <div className="flex flex-wrap gap-1">
              {doctor.languages.map((l) => (
                <span key={l} className="text-[11px] bg-white text-gray-600 px-1.5 py-0.5 rounded-full">{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-emerald-50/60 rounded-xl p-3.5 mb-5">
          <span className="text-sm text-gray-500">{lang === "hi" ? "परामर्श शुल्क" : "Consultation fee"}</span>
          <span className="font-bold text-gray-900">{inr(doctor.fee)}</span>
        </div>

        <button
          disabled={!doctor.available}
          onClick={() => onBook(doctor)}
          className={`w-full font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 ${
            doctor.available ? "bg-[#0F7A4C] hover:bg-[#0B4A30] text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <PhoneCall size={17} />
          {doctor.available ? (lang === "hi" ? "अभी बुक करें" : "Book Consultation") : (lang === "hi" ? "अभी अनुपलब्ध" : "Currently unavailable")}
        </button>
      </div>
    </div>
  );
}

function Doctors({ lang, push }) {
  const [booking, setBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState("all");

  const specialties = ["all", ...Array.from(new Set(DOCTORS.map((d) => d.specialty)))];

  const shown = filter === "all" ? DOCTORS : DOCTORS.filter((d) => d.specialty === filter);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{lang === "hi" ? "हमारे डॉक्टर" : "Our Doctors"}</h2>
      <p className="text-gray-500 text-sm mb-6">{lang === "hi" ? "योग्यता के साथ भरोसेमंद डॉक्टर" : "Qualified doctors you can trust"}</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border ${
              filter === s ? "bg-[#0F7A4C] text-white border-[#0F7A4C]" : "bg-white text-gray-600 border-emerald-200 hover:bg-emerald-50/60"
            }`}
          >
            {s === "all" ? (lang === "hi" ? "सभी" : "All") : s}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((d) => (
          <div
            key={d.id}
            onClick={() => setProfile(d)}
            role="button"
            tabIndex={0}
            className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-shadow flex flex-col cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${d.color}22` }}>
                <User size={22} style={{ color: d.color }} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{d.name}</div>
                <div className="text-xs text-gray-500 truncate">{d.qualification}</div>
              </div>
            </div>
            <div className="text-sm font-medium mb-2" style={{ color: d.color }}>{d.specialty}</div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> {d.rating}</span>
              <span>{d.experience} {lang === "hi" ? "वर्ष अनुभव" : "yrs exp"}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {d.languages.map((l) => (
                <span key={l} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{l}</span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-900">{inr(d.fee)}</span>
              <button
                disabled={!d.available}
                onClick={(e) => {
                  e.stopPropagation();
                  setBooking(d);
                }}
                className={`text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
                  d.available ? "bg-[#0F7A4C] text-white hover:bg-[#0B4A30]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Calendar size={13} />
                {d.available ? (lang === "hi" ? "बुक करें" : "Book Now") : (lang === "hi" ? "अनुपलब्ध" : "Unavailable")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {profile && (
        <DoctorProfileModal
          doctor={profile}
          lang={lang}
          onClose={() => setProfile(null)}
          onBook={(d) => {
            setProfile(null);
            setBooking(d);
          }}
        />
      )}
      {booking && <BookingModal doctor={booking} lang={lang} onClose={() => setBooking(null)} push={push} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ambulance                                                            */
/* ------------------------------------------------------------------ */

const PATIENT = { x: 60, y: 230, lat: 28.98, lng: 77.55, name: "Your location · Rampur Kalan" };

function RuralMap({ progress, phase }) {
  const t = Math.min(100, progress) / 100;
  const ax = PATIENT.x + (HOSPITAL.x - PATIENT.x) * t;
  const ay = PATIENT.y + (HOSPITAL.y - PATIENT.y) * t;

  return (
    <svg viewBox="0 0 400 340" className="w-full h-full">
      <rect width="400" height="340" fill="#EAF6EE" />
      <path d="M60 230 L210 150 L350 90" stroke="#BFE3CC" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M60 230 L300 310 L350 90" stroke="#D8ECDD" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M210 150 L140 90" stroke="#D8ECDD" strokeWidth="6" strokeLinecap="round" fill="none" />
      {VILLAGES.map((v) => (
        <g key={v.id}>
          <circle cx={v.x} cy={v.y} r="5" fill="#0F7A4C" />
          <text x={v.x + 9} y={v.y + 4} fontSize="10" fill="#33604A" fontFamily="Inter, sans-serif">{v.name}</text>
        </g>
      ))}
      <g>
        <rect x={HOSPITAL.x - 10} y={HOSPITAL.y - 10} width="20" height="20" rx="4" fill="#C0392B" />
        <text x={HOSPITAL.x + 13} y={HOSPITAL.y + 4} fontSize="10" fontWeight="600" fill="#8E2A20" fontFamily="Inter, sans-serif">Civil Hospital</text>
      </g>
      <g>
        <circle cx={PATIENT.x} cy={PATIENT.y} r="9" fill="#0F7A4C" opacity="0.25" className={phase !== "idle" ? "animate-ping-slow" : ""} />
        <circle cx={PATIENT.x} cy={PATIENT.y} r="6" fill="#0F7A4C" stroke="white" strokeWidth="2" />
        <text x={PATIENT.x - 34} y={PATIENT.y + 22} fontSize="10" fontWeight="600" fill="#0B4A30" fontFamily="Inter, sans-serif">You are here</text>
      </g>
      {phase !== "idle" && (
        <g transform={`translate(${ax}, ${ay})`}>
          <circle r="11" fill="#C0392B" />
          <text x="0" y="4" fontSize="12" textAnchor="middle" fill="white">🚑</text>
        </g>
      )}
    </svg>
  );
}

function AmbulanceSection({ lang, push, sosTrigger }) {
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(12);
  const timerRef = useRef(null);

  const startCall = () => {
    setPhase("requesting");
    setProgress(0);
    setEta(12);
    setTimeout(() => {
      setPhase("dispatched");
      push(lang === "hi" ? "एम्बुलेंस भेज दी गई है!" : "Ambulance has been dispatched!");
    }, 1800);
  };

  useEffect(() => {
    if (sosTrigger) startCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosTrigger]);

  useEffect(() => {
    if (phase === "dispatched") {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 4;
          if (next >= 100) {
            clearInterval(timerRef.current);
            setPhase("arrived");
            push(lang === "hi" ? "एम्बुलेंस पहुँच गई है!" : "Ambulance has arrived!");
            return 100;
          }
          return next;
        });
        setEta((e) => Math.max(0, e - 0.5));
      }, 350);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  const reset = () => {
    setPhase("idle");
    setProgress(0);
    setEta(12);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{lang === "hi" ? "एम्बुलेंस सेवा" : "Ambulance Service"}</h2>
      <p className="text-gray-500 text-sm mb-6">{lang === "hi" ? "24/7 आपातकालीन सहायता, ग्रामीण उत्तर भारत" : "24/7 emergency response across rural North India"}</p>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
        <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-72 sm:h-96">
            <RuralMap progress={progress} phase={phase} />
          </div>
          <div className="p-4 border-t border-emerald-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={12} /> {PATIENT.name}</span>
            <span className="flex items-center gap-1"><Building2 size={12} /> {HOSPITAL.name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
            {phase === "idle" && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center"><Ambulance size={22} className="text-red-600" /></div>
                  <div>
                    <div className="font-semibold text-gray-900">{lang === "hi" ? "एम्बुलेंस बुलाएं" : "Request an Ambulance"}</div>
                    <div className="text-xs text-gray-500">{lang === "hi" ? "औसत पहुँच समय: 12-15 मिनट" : "Avg. response time: 12-15 min"}</div>
                  </div>
                </div>
                <button
                  onClick={startCall}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 mb-3"
                >
                  <Siren size={18} /> {lang === "hi" ? "अभी एम्बुलेंस बुलाएं" : "Call Ambulance Now"}
                </button>
                <a
                  href="tel:108"
                  className="w-full border border-red-200 text-red-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50"
                >
                  <Phone size={16} /> {lang === "hi" ? "108 पर सीधे कॉल करें" : "Direct Call: 108"}
                </a>
              </>
            )}

            {phase === "requesting" && (
              <div className="py-6 flex flex-col items-center gap-3">
                <Loader2 size={30} className="animate-spin text-red-600" />
                <p className="text-gray-700 text-sm font-medium">{lang === "hi" ? "अनुरोध भेजा जा रहा है..." : "Requesting nearest ambulance..."}</p>
              </div>
            )}

            {phase === "dispatched" && (
              <div>
                <div className="flex items-center gap-2 text-red-600 font-semibold mb-3">
                  <Ambulance size={18} className="animate-bounce-x" /> {lang === "hi" ? "एम्बुलेंस रास्ते में है" : "Ambulance is on the way"}
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{lang === "hi" ? "अनुमानित समय" : "ETA"}</span>
                  <span className="font-semibold text-gray-800">{eta.toFixed(0)} {lang === "hi" ? "मिनट" : "min"}</span>
                </div>
                <a href="tel:108" className="w-full border border-emerald-200 text-gray-700 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50/60 text-sm">
                  <Phone size={14} /> {lang === "hi" ? "ड्राइवर को कॉल करें" : "Call Driver"}
                </a>
              </div>
            )}

            {phase === "arrived" && (
              <div className="py-4 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-[#0F7A4C]" />
                <p className="font-semibold text-gray-900">{lang === "hi" ? "एम्बुलेंस पहुँच गई है" : "Ambulance has arrived"}</p>
                <p className="text-gray-500 text-sm">{lang === "hi" ? "कृपया बाहर आएं।" : "Please come outside to meet the crew."}</p>
                <button onClick={reset} className="mt-1 text-sm font-medium text-[#0F7A4C] underline">
                  {lang === "hi" ? "ठीक है" : "Done"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <div className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-[#0F7A4C]" /> {lang === "hi" ? "पास के स्वास्थ्य केंद्र" : "Nearby Health Centres"}
            </div>
            <div className="flex flex-col gap-3">
              {DISPENSARIES.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-gray-800 font-medium">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.distance}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <a href={`tel:${d.phone}`} className="p-1.5 rounded-lg bg-emerald-50 text-[#0F7A4C]"><Phone size={13} /></a>
                    <a href={mapsLink(d.lat, d.lng, d.name)} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-emerald-50 text-[#0F7A4C]"><Navigation size={13} /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pharmacy                                                             */
/* ------------------------------------------------------------------ */

const UPI_APPS = [
  { id: "phonepe", label: "PhonePe", bg: "#5F259F" },
  { id: "gpay", label: "Google Pay", bg: "#1A73E8" },
  { id: "paytm", label: "Paytm", bg: "#00B9F1" },
  { id: "bhim", label: "BHIM", bg: "#0F7A4C" },
];

function Pharmacy({ lang, push, cart, setCart }) {
  const [checkout, setCheckout] = useState(false);
  const [payMethod, setPayMethod] = useState("cod");
  const [upiApp, setUpiApp] = useState("phonepe");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [village, setVillage] = useState(VILLAGES[0].id);

  const addToCart = (med) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === med.id);
      if (existing) return c.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...med, qty: 1 }];
    });
    push(lang === "hi" ? `${med.name} कार्ट में जोड़ा गया` : `${med.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = () => {
    if (payMethod === "upi" && !upiId.trim()) {
      push(lang === "hi" ? "कृपया UPI आईडी दर्ज करें" : "Please enter your UPI ID", "warn");
      return;
    }
    if (payMethod === "card" && (cardNumber.replace(/\s/g, "").length < 12 || !cardExpiry || cardCvv.length < 3)) {
      push(lang === "hi" ? "कृपया कार्ड विवरण पूरा भरें" : "Please complete the card details", "warn");
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      const orderId = "ESJ" + Math.floor(100000 + Math.random() * 899999);
      setPlaced({ orderId, total, method: payMethod });
      push(lang === "hi" ? "ऑर्डर सफलतापूर्वक दिया गया!" : "Order placed successfully!");
    }, 1600);
  };

  const closeCheckout = () => {
    setCheckout(false);
    setPlaced(null);
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    if (placed) setCart([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{lang === "hi" ? "दवाई ऑर्डर करें" : "Order Medicines"}</h2>
        <button
          onClick={() => cart.length && setCheckout(true)}
          className="relative flex items-center gap-2 bg-[#0F7A4C] text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-40"
          disabled={!cart.length}
        >
          <ShoppingCart size={16} />
          {lang === "hi" ? "कार्ट" : "Cart"} ({cart.reduce((s, i) => s + i.qty, 0)})
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-6">{lang === "hi" ? "आवश्यक दवाएं घर तक मंगवाएं" : "Get essential medicines delivered to your home"}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MEDICINES.map((m) => (
          <div key={m.id} className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
              <Pill size={18} className="text-[#0F7A4C]" />
            </div>
            <div className="font-semibold text-gray-900 text-sm mb-0.5">{m.name}</div>
            <div className="text-xs text-gray-500 mb-3 flex-1">{m.desc}</div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-sm">{inr(m.price)}</span>
              <button onClick={() => addToCart(m)} className="text-xs font-semibold bg-emerald-50 text-[#0F7A4C] hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Plus size={12} /> {lang === "hi" ? "जोड़ें" : "Add"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {checkout && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-end sm:items-center justify-center" onClick={closeCheckout}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeCheckout} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

            {!placed ? (
              <>
                <h3 className="font-bold text-lg text-gray-900 mb-4">{lang === "hi" ? "कार्ट और भुगतान" : "Cart & Checkout"}</h3>

                <div className="flex flex-col gap-3 mb-5 max-h-52 overflow-y-auto">
                  {cart.map((i) => (
                    <div key={i.id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 truncate">{i.name}</div>
                        <div className="text-xs text-gray-500">{inr(i.price)} × {i.qty}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => updateQty(i.id, -1)} className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Minus size={12} /></button>
                        <span className="w-4 text-center text-xs font-semibold">{i.qty}</span>
                        <button onClick={() => updateQty(i.id, 1)} className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Plus size={12} /></button>
                        <button onClick={() => removeItem(i.id)} className="w-6 h-6 rounded-md bg-red-50 text-red-500 flex items-center justify-center ml-1"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{lang === "hi" ? "डिलीवरी गांव" : "Delivery village"}</label>
                  <select value={village} onChange={(e) => setVillage(e.target.value)} className="w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm">
                    {VILLAGES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>

                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{lang === "hi" ? "भुगतान विधि" : "Payment method"}</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { id: "cod", label: lang === "hi" ? "कैश" : "COD", icon: Banknote },
                      { id: "upi", label: "UPI", icon: Wallet },
                      { id: "card", label: lang === "hi" ? "कार्ड" : "Card", icon: CreditCard },
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPayMethod(p.id)}
                          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium ${
                            payMethod === p.id ? "border-[#0F7A4C] bg-emerald-50 text-[#0B4A30]" : "border-emerald-200 text-gray-500"
                          }`}
                        >
                          <Icon size={16} /> {p.label}
                        </button>
                      );
                    })}
                  </div>

                  {payMethod === "upi" && (
                    <div className="bg-emerald-50/60 rounded-xl p-3.5 animate-fade-in">
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {UPI_APPS.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => setUpiApp(app.id)}
                            className={`flex flex-col items-center gap-1.5 py-2 rounded-lg border text-[10px] font-semibold ${
                              upiApp === app.id ? "border-[#0F7A4C] bg-white ring-2 ring-emerald-100" : "border-emerald-200 bg-white text-gray-500"
                            }`}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                              style={{ backgroundColor: app.bg }}
                            >
                              {app.label[0]}
                            </div>
                            <span className="text-gray-700 leading-tight text-center">{app.label}</span>
                          </button>
                        ))}
                      </div>
                      <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                        {lang === "hi" ? "UPI आईडी" : "UPI ID"}
                      </label>
                      <input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                  )}

                  {payMethod === "card" && (
                    <div className="bg-emerald-50/60 rounded-xl p-3.5 flex flex-col gap-2.5 animate-fade-in">
                      <div>
                        <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                          {lang === "hi" ? "कार्ड नंबर" : "Card number"}
                        </label>
                        <input
                          value={cardNumber}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                            setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
                          }}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm bg-white tracking-wider"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                            {lang === "hi" ? "समाप्ति (MM/YY)" : "Expiry (MM/YY)"}
                          </label>
                          <input
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                              if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                              setCardExpiry(v);
                            }}
                            placeholder="MM/YY"
                            inputMode="numeric"
                            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 mb-1 block">CVV</label>
                          <input
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            placeholder="•••"
                            inputMode="numeric"
                            type="password"
                            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm mb-5 pt-3 border-t border-emerald-100">
                  <span className="text-gray-500">{lang === "hi" ? "कुल राशि" : "Total"}</span>
                  <span className="font-bold text-gray-900 text-lg">{inr(total)}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="w-full bg-[#0F7A4C] hover:bg-[#0B4A30] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  {placing ? <Loader2 size={17} className="animate-spin" /> : <ShieldCheck size={17} />}
                  {placing ? (lang === "hi" ? "ऑर्डर हो रहा है..." : "Placing order...") : (lang === "hi" ? "ऑर्डर करें" : "Place Order")}
                </button>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={40} className="text-[#0F7A4C]" />
                <p className="font-bold text-gray-900">{lang === "hi" ? "ऑर्डर सफल!" : "Order Confirmed!"}</p>
                <p className="text-gray-500 text-sm">
                  {lang === "hi" ? "ऑर्डर आईडी" : "Order ID"}: <span className="font-mono font-semibold">{placed.orderId}</span>
                </p>
                <p className="text-gray-500 text-sm">{lang === "hi" ? "अनुमानित डिलीवरी: कल तक" : "Estimated delivery: by tomorrow"}</p>
                <button onClick={closeCheckout} className="mt-2 bg-[#0F7A4C] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                  {lang === "hi" ? "बंद करें" : "Close"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reminders                                                            */
/* ------------------------------------------------------------------ */

function Reminders({ lang, push, reminders, setReminders }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("08:00");
  const [freq, setFreq] = useState("daily");
  const firedRef = useRef({});

  const addReminder = () => {
    if (!name.trim()) {
      push(lang === "hi" ? "कृपया दवा का नाम लिखें" : "Please enter a medicine name", "warn");
      return;
    }
    setReminders((r) => [...r, { id: Date.now(), name: name.trim(), time, freq, taken: false }]);
    push(lang === "hi" ? "रिमाइंडर सेट हो गया" : "Reminder set successfully");
    setName("");
  };

  const removeReminder = (id) => setReminders((r) => r.filter((x) => x.id !== id));
  const markTaken = (id) =>
    setReminders((r) => r.map((x) => (x.id === id ? { ...x, taken: true } : x)));

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const current = `${hh}:${mm}`;
      reminders.forEach((r) => {
        const key = `${r.id}-${current}`;
        if (r.time === current && !firedRef.current[key]) {
          firedRef.current[key] = true;
          push(
            lang === "hi"
              ? `⏰ दवा का समय: ${r.name} लेना न भूलें!`
              : `⏰ Medicine time: don't forget to take ${r.name}!`,
            "warn"
          );
        }
      });
    };
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, [reminders, lang, push]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{lang === "hi" ? "दवा रिमाइंडर" : "Medicine Reminders"}</h2>
      <p className="text-gray-500 text-sm mb-6">{lang === "hi" ? "समय पर दवा लेना कभी न भूलें" : "Never forget to take your medicine on time"}</p>

      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === "hi" ? "दवा का नाम" : "Medicine name"}
            className="border border-emerald-200 rounded-xl px-3 py-2.5 text-sm"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-emerald-200 rounded-xl px-3 py-2.5 text-sm"
          />
          <select value={freq} onChange={(e) => setFreq(e.target.value)} className="border border-emerald-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="daily">{lang === "hi" ? "रोज़" : "Daily"}</option>
            <option value="once">{lang === "hi" ? "एक बार" : "Once"}</option>
          </select>
          <button onClick={addReminder} className="bg-[#0F7A4C] hover:bg-[#0B4A30] text-white font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm">
            <Plus size={15} /> {lang === "hi" ? "जोड़ें" : "Add"}
          </button>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-14 text-gray-400 text-sm">
          {lang === "hi" ? "अभी कोई रिमाइंडर नहीं है।" : "No reminders yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reminders.map((r) => (
            <div key={r.id} className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.taken ? "bg-emerald-50" : "bg-amber-50"}`}>
                  {r.taken ? <CheckCircle2 size={18} className="text-[#0F7A4C]" /> : <Bell size={18} className="text-amber-600" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock size={11} /> {r.time} · {r.freq === "daily" ? (lang === "hi" ? "रोज़" : "Daily") : (lang === "hi" ? "एक बार" : "Once")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!r.taken && (
                  <button onClick={() => markTaken(r.id)} className="text-xs font-semibold bg-emerald-50 text-[#0F7A4C] px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                    {lang === "hi" ? "ले लिया" : "Taken"}
                  </button>
                )}
                <button onClick={() => removeReminder(r.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Chatbot (bilingual, calls Claude via the Anthropic API)          */
/* ------------------------------------------------------------------ */

function Chatbot({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text:
            lang === "hi"
              ? "नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। आप मुझसे लक्षणों, दवाओं या स्वास्थ्य सलाह के बारे में पूछ सकते हैं। (आपातकाल में कृपया एम्बुलेंस बुलाएं।)"
              : "Hello! I'm your health assistant. Ask me about symptoms, medicines, or general health advice. (For emergencies, please call an ambulance.)",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt =
        lang === "hi"
          ? "आप E-Sanjeevni के लिए एक सहायक स्वास्थ्य सहायक हैं, जो ग्रामीण उत्तर भारत के मरीज़ों की मदद करते हैं। सरल, छोटे और स्पष्ट हिंदी में जवाब दें। कभी भी निश्चित निदान न दें और गंभीर या आपातकालीन लक्षणों के लिए हमेशा तुरंत डॉक्टर से मिलने या एम्बुलेंस (108) बुलाने की सलाह दें। आप एक डॉक्टर का विकल्प नहीं हैं।"
          : "You are a helpful health assistant for E-Sanjeevni, supporting patients in rural North India. Reply in simple, short, clear English. Never give a definitive diagnosis, and always advise seeing a doctor or calling an ambulance (108) for serious or emergency symptoms. You are not a substitute for a doctor.";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: nextMessages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const textBlocks = (data.content || []).filter((b) => b.type === "text").map((b) => b.text);
      const replyText =
        textBlocks.join("\n").trim() ||
        (lang === "hi" ? "माफ़ कीजिए, मैं अभी जवाब नहीं दे पा रहा।" : "Sorry, I couldn't generate a reply right now.");

      setMessages((m) => [...m, { role: "assistant", text: replyText }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            lang === "hi"
              ? "कनेक्शन में समस्या हुई। कृपया दोबारा कोशिश करें।"
              : "There was a connection problem. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-[#0F7A4C] text-white shadow-2xl border-2 border-white hover:bg-[#0B4A30] transition-colors med3d-chat-glow"
        aria-label="Chatbot"
      >
        <span className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
          {!open && <span className="absolute inset-0 rounded-full bg-emerald-300/70 animate-ping-slow" />}
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </span>
        {!open && <span className="text-sm font-semibold whitespace-nowrap">{lang === "hi" ? "सहायक" : "Ask AI"}</span>}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[92vw] max-w-sm h-[65vh] bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
          <div className="bg-[#0F7A4C] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Stethoscope size={16} /></div>
              <div>
                <div className="text-sm font-semibold">{lang === "hi" ? "स्वास्थ्य सहायक" : "Health Assistant"}</div>
                <div className="text-[10px] text-emerald-100">{lang === "hi" ? "ऑनलाइन" : "Online"}</div>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === "hi" ? "en" : "hi")}
              className="text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-md flex items-center gap-1"
            >
              <Languages size={11} /> {lang === "hi" ? "EN" : "हिं"}
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 bg-emerald-50/60">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                m.role === "user" ? "bg-[#0F7A4C] text-white self-end rounded-br-sm" : "bg-white text-gray-800 self-start rounded-bl-sm border border-emerald-100"
              }`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-white text-gray-500 border border-emerald-100 px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1.5 text-sm">
                <Loader2 size={13} className="animate-spin" /> {lang === "hi" ? "लिख रहा है..." : "typing..."}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-emerald-100 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={lang === "hi" ? "अपना सवाल लिखें..." : "Type your question..."}
              className="flex-1 border border-emerald-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F7A4C]"
            />
            <button onClick={send} disabled={loading} className="w-10 h-10 rounded-xl bg-[#0F7A4C] text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Main App                                                             */
/* ------------------------------------------------------------------ */

export default function ESanjeevniApp() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("hi");
  const [cart, setCart] = useState([]);
  const [reminders, setReminders] = useState([
    { id: 1, name: "Paracetamol 500mg", time: "09:00", freq: "daily", taken: false },
    { id: 2, name: "Iron & Folic Acid", time: "20:00", freq: "daily", taken: false },
  ]);
  const [sosTrigger, setSosTrigger] = useState(0);
  const { toasts, push } = useToasts();

  const handleSOS = () => {
    setTab("ambulance");
    setSosTrigger((n) => n + 1);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#D8F1E1] via-[#EAF7EE] to-[#D8F1E1] font-sans"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(15,122,76,0.18) 1.5px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.4s ease both; }

        @keyframes toastIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        .animate-toast-in { animation: toastIn 0.3s ease both; }

        @keyframes pingSlow { 0% { transform: scale(1); opacity: 0.6; } 70%,100% { transform: scale(2.4); opacity: 0; } }
        .animate-ping-slow { animation: pingSlow 1.8s cubic-bezier(0,0,0.2,1) infinite; transform-origin: center; }

        @keyframes pulseSlow { 0%,100% { opacity: 1; } 50% { opacity: 0.75; } }
        .animate-pulse-slow { animation: pulseSlow 1.8s ease-in-out infinite; }

        @keyframes bounceX { 0%,100% { transform: translateX(0);} 50% { transform: translateX(3px);} }
        .animate-bounce-x { animation: bounceX 0.8s ease-in-out infinite; }

        @keyframes med3dFloat { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-14px);} }
        .med3d-float { animation: med3dFloat 4s ease-in-out infinite; }

        @keyframes med3dWobble { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        .med3d-wobble { animation: med3dWobble 5s ease-in-out infinite; transform-origin: 50% 85%; }

        @keyframes med3dShadow { 0%,100% { transform: translateX(-50%) scaleX(1); opacity: 0.9; } 50% { transform: translateX(-50%) scaleX(0.8); opacity: 0.55; } }
        .med3d-shadow { animation: med3dShadow 4s ease-in-out infinite; }

        @keyframes chatGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(15,122,76,0.45), 0 10px 25px rgba(0,0,0,0.2); } 50% { box-shadow: 0 0 0 10px rgba(15,122,76,0), 0 10px 25px rgba(0,0,0,0.2); } }
        .med3d-chat-glow { animation: chatGlow 2.4s ease-out infinite; }

        @keyframes med3dCapsuleA { 0%,100% { transform: translate(0,0) rotate(-12deg);} 50% { transform: translate(6px,-16px) rotate(-4deg);} }
        .med3d-capsule-a { animation: med3dCapsuleA 3.4s ease-in-out infinite; }

        @keyframes med3dCapsuleB { 0%,100% { transform: translate(0,0) rotate(15deg);} 50% { transform: translate(-8px,-10px) rotate(24deg);} }
        .med3d-capsule-b { animation: med3dCapsuleB 3.9s ease-in-out infinite; }

        @keyframes med3dCapsuleC { 0%,100% { transform: translate(0,0) rotate(-6deg);} 50% { transform: translate(8px,14px) rotate(-16deg);} }
        .med3d-capsule-c { animation: med3dCapsuleC 4.4s ease-in-out infinite; }
      `}</style>

      <Navbar tab={tab} setTab={setTab} cartCount={cart.reduce((s, i) => s + i.qty, 0)} onSOS={handleSOS} lang={lang} setLang={setLang} />

      {tab === "home" && <HomePage setTab={setTab} lang={lang} onSOS={handleSOS} />}
      {tab === "doctors" && <Doctors lang={lang} push={push} />}
      {tab === "ambulance" && <AmbulanceSection lang={lang} push={push} sosTrigger={sosTrigger} />}
      {tab === "pharmacy" && <Pharmacy lang={lang} push={push} cart={cart} setCart={setCart} />}
      {tab === "reminders" && <Reminders lang={lang} push={push} reminders={reminders} setReminders={setReminders} />}

      <footer className="bg-[#0B4A30] text-emerald-100/70 text-center text-xs py-6 mt-6">
        {lang === "hi" ? "E-Sanjeevni — ग्रामीण भारत के लिए स्वास्थ्य सेवा" : "E-Sanjeevni — Healthcare for Rural India"} · Emergency: <a href="tel:108" className="underline text-white">108</a>
      </footer>

      <Chatbot lang={lang} setLang={setLang} />
      <ToastStack toasts={toasts} />
    </div>
  );
}
