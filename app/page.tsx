"use client";

import { useState, useEffect } from "react";
import OpenAI from "openai";
import { 
  Search, Moon, Sun, Globe, User, ThumbsUp, ThumbsDown, 
  ExternalLink, Sparkles, Check, Settings, History, Trash2, 
  X, Image as ImageIcon, LogOut 
} from "lucide-react";

const LANGUAGES = [
  { code: "uz", name: "O'zbekcha" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "tr", name: "Türkçe" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "pt", name: "Português" },
  { code: "hi", name: "हिन्दी" },
  { code: "fa", name: "فارسی" }
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLang, setSelectedLang] = useState("uz");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Sozlamalar va Tarix holatlari
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [bgImage, setBgImage] = useState<string>("");
  const [tempBgImage, setTempBgImage] = useState<string>("");

  // LocalStorage orqali saqlangan ma'lumotlarni yuklash
  useEffect(() => {
    const savedHistory = localStorage.getItem("spotly_history");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

    const savedBg = localStorage.getItem("spotly_bg");
    if (savedBg) {
      setBgImage(savedBg);
      setTempBgImage(savedBg);
    }
  }, []);

  // Tarixga qo'shish
  const addToHistory = (searchTerm: string) => {
    const updated = [searchTerm, ...searchHistory.filter((item) => item !== searchTerm)];
    setSearchHistory(updated);
    localStorage.setItem("spotly_history", JSON.stringify(updated));
  };

  // Tarixdan bittalab o'chirish
  const deleteHistoryItem = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("spotly_history", JSON.stringify(updated));
  };

  // Hammasini o'chirish
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("spotly_history");
  };

  // Background rasm o'rnatish
  const applyBgImage = () => {
    setBgImage(tempBgImage);
    localStorage.setItem("spotly_bg", tempBgImage);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    addToHistory(query);
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Siz Spotly platformasining aqlli AI qidiruv tizimisiz. Foydalanuvchi so'roviga mos 2-3 ta real veb-sayt yoki Telegram kanallarni toping va ularning afzallik hamda kamchiliklarini tahlil qiling. 
            Javobingizni har doim tanlangan til kodi (${selectedLang}) tilida bering.
            Javobni FAQAT to'g'ri JSON formatida qaytaring:
            {
              "items": [
                {
                  "title": "Manba nomi",
                  "type": "Website yoki Telegram Channel",
                  "link": "https://...",
                  "pros": ["Yaxshi tomoni 1", "Yaxshi tomoni 2"],
                  "cons": ["Kamchiligi 1"]
                }
              ]
            }`
          },
          {
            role: "user",
            content: query
          }
        ],
        response_format: { type: "json_object" }
      });

      const rawContent = response.choices[0].message.content;
      if (rawContent) {
        const parsedData = JSON.parse(rawContent);
        setResults(parsedData.items || parsedData.results || []);
      }
    } catch (err: any) {
      console.error(err);
      setError("AI tahlilida xatolik yuz berdi. API kalitingizni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 relative bg-cover bg-center bg-no-repeat ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
      style={bgImage ? { backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('${bgImage}')` } : {}}
    >
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-700/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Spotly
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2.5 rounded-xl border transition flex items-center gap-2 text-sm font-medium ${
                darkMode ? "border-slate-800 bg-slate-900 hover:bg-slate-800" : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              <Settings className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Sozlamalar</span>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-lg transition">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Kirish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Nima izlayapsiz? <br />
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Spotly eng yaxshisini saralab beradi.
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Spotly — Siz uchun eng yaxshi veb-sayt va Telegram kanallarni saralab topuvchi aqlli qidiruv platformasi.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masalan: inglizcha 5-10 minutlik matematika podcast telegram kanal..."
              className={`w-full pl-6 pr-36 py-4 rounded-2xl text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-xl ${
                darkMode ? "bg-slate-900/90 border-slate-800 text-white placeholder-slate-500" : "bg-white/90 border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Qidirish</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              Saralangan Manbalar:
            </h3>

            <div className="grid gap-6">
              {results.map((res, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-3xl border shadow-xl transition hover:border-blue-500/40 ${
                    darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/90 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {res.type}
                      </span>
                      <h4 className="text-xl font-bold mt-2">{res.title}</h4>
                    </div>

                    <a
                      href={res.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 transition shrink-0"
                    >
                      Manbaga o'tish <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/30">
                    <div className="space-y-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                        <ThumbsUp className="w-4 h-4" /> Afzalliklari:
                      </span>
                      <ul className="space-y-1">
                        {res.pros?.map((p: string, i: number) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                      <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                        <ThumbsDown className="w-4 h-4" /> Kamchiliklari:
                      </span>
                      <ul className="space-y-1">
                        {res.cons?.map((c: string, i: number) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-rose-400 font-bold">•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- SETTINGS MODAL --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-700/40 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Settings className="w-5 h-5 text-blue-400" />
                <span>Sozlamalar</span>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5 opacity-70" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* 1. Theme / Night Light Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Night Light (Mavzu)</h4>
                  <p className="text-xs text-slate-400">Qorong'u va yorug' rejimni tanlang</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-2xl border transition flex items-center gap-2 ${
                    darkMode ? "border-slate-700 bg-slate-800 text-amber-400" : "border-slate-200 bg-slate-100 text-slate-700"
                  }`}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-xs font-bold">{darkMode ? "Yorug'" : "Qorong'u"}</span>
                </button>
              </div>

              {/* 2. Language Selection */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Tilni tanlang
                </h4>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200 text-slate-900"
                  }`}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Background Image URL */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-400" /> Orqa fon rasmi (URL)
                </h4>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo..."
                    value={tempBgImage}
                    onChange={(e) => setTempBgImage(e.target.value)}
                    className={`flex-1 p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200 text-slate-900"
                    }`}
                  />
                  <button
                    onClick={applyBgImage}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition"
                  >
                    O'rnatish
                  </button>
                </div>
              </div>

              {/* 4. Search History */}
              <div className="space-y-3 pt-2 border-t border-slate-700/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-400" /> Qidiruv Tarixi
                  </h4>
                  {searchHistory.length > 0 && (
                    <button
                      onClick={clearAllHistory}
                      className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hammasini o'chirish
                    </button>
                  )}
                </div>

                {searchHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">Qidiruv tarixi bo'sh.</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                          darkMode ? "bg-slate-800/60 border-slate-700/60" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <span 
                          className="cursor-pointer truncate hover:text-blue-400 transition"
                          onClick={() => {
                            setQuery(item);
                            setIsSettingsOpen(false);
                          }}
                        >
                          {item}
                        </span>
                        <button
                          onClick={() => deleteHistoryItem(item)}
                          className="p-1 hover:text-rose-400 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Log Out */}
              <div className="pt-4 border-t border-slate-700/40">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 transition"
                >
                  <LogOut className="w-4 h-4" /> Tizimdan Chiqish (Log Out)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
