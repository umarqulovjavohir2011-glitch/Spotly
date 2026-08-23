"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin, Star, Sparkles, Loader2, Settings, X, Moon, Sun, Trash2, Clock, ExternalLink, DollarSign } from "lucide-react"

type Place = {
  name: string
  category: string
  rating: string
  price?: string
  link?: string
  description: string
}

const T: Record<string, any> = {
  en: { subtitle: "Find the most amazing places, channels, and content around you with AI", placeholder: "e.g., Daily English Podcast, A cozy cafe...", search: "Search", clearInput: "Clear", settings: "Settings", apiKeyLabel: "Groq API Key", langLabel: "Select Language", themeLabel: "Theme (Dark/Light)", historyLabel: "Search History", clearBtn: "Clear History", closeBtn: "Save & Close", noHistory: "History is empty", error: "An error occurred during search.", visitSite: "Visit Source / Website" },
  uz: { subtitle: "Atrofingizdagi eng ajoyib joylar, kanallar va manbalarni AI bilan toping", placeholder: "Masalan: Har kunlik inglizcha podcast, shinam qahvaxona...", search: "Qidirish", clearInput: "Tozalash", settings: "Sozlamalar", apiKeyLabel: "Groq API Kaliti", langLabel: "Tilni tanlang", themeLabel: "Mavzu (Tungi/Kunduzgi)", historyLabel: "Qidiruv tarixi", clearBtn: "Tarixni tozalash", closeBtn: "Saqlash va Yopish", noHistory: "Tarix bo'sh", error: "Qidiruvda xatolik yuz berdi.", visitSite: "Sayt / Kanalga o'tish" },
  ru: { subtitle: "Найдите самые удивительные места, каналы и ресурсы с помощью ИИ", placeholder: "Например: Английский подкаст, уютное кафе...", search: "Поиск", clearInput: "Очистить", settings: "Настройки", apiKeyLabel: "Ключ Groq API", langLabel: "Выберите язык", themeLabel: "Тема (Темная/Светлая)", historyLabel: "История поиска", clearBtn: "Очистить историю", closeBtn: "Сохранить и закрыть", noHistory: "История пуста", error: "Произошла ошибка при поиске.", visitSite: "Перейти на сайт / канал" },
  tr: { subtitle: "Yapay zeka ile en harika yerleri, kanalları ve içerikleri bulun", placeholder: "Örn: İngilizce podcast, şık bir kafe...", search: "Ara", clearInput: "Temizle", settings: "Ayarlar", apiKeyLabel: "Groq API Anahtarı", langLabel: "Dil Seçin", themeLabel: "Tema (Karanlık/Aydınlık)", historyLabel: "Arama Geçmişi", clearBtn: "Geçmişi Temizle", closeBtn: "Kaydet ve Kapat", noHistory: "Geçmiş boş", error: "Arama sırasında bir hata oluştu.", visitSite: "Siteye / Kanala Git" },
  de: { subtitle: "Finden Sie die besten Orte, Kanäle und Inhalte mit KI", placeholder: "z.B. Englisch Podcast, Gemütliches Café...", search: "Suchen", clearInput: "Löschen", settings: "Einstellungen", apiKeyLabel: "Groq API-Schlüssel", langLabel: "Sprache wählen", themeLabel: "Design (Dunkel/Hell)", historyLabel: "Suchverlauf", clearBtn: "Verlauf löschen", closeBtn: "Speichern & Schließen", noHistory: "Verlauf ist leer", error: "Fehler bei der Suche.", visitSite: "Website / Kanal besuchen" },
  fr: { subtitle: "Trouvez les lieux, chaînes et contenus les plus incroyables grâce à l'IA", placeholder: "ex : Podcast Anglais, Un café...", search: "Rechercher", clearInput: "Effacer", settings: "Paramètres", apiKeyLabel: "Clé API Groq", langLabel: "Choisir la langue", themeLabel: "Thème (Sombre/Clair)", historyLabel: "Historique", clearBtn: "Effacer l'historique", closeBtn: "Enregistrer et fermer", noHistory: "L'historique est vide", error: "Une erreur est survenue.", visitSite: "Visiter le site / la chaîne" },
  es: { subtitle: "Encuentra los lugares, canales y recursos más increíbles con IA", placeholder: "ej., Podcast de inglés, Un café...", search: "Buscar", clearInput: "Limpiar", settings: "Ajustes", apiKeyLabel: "Clave API Groq", langLabel: "Seleccionar idioma", themeLabel: "Tema (Oscuro/Claro)", historyLabel: "Historial de búsqueda", clearBtn: "Borrar historial", closeBtn: "Guardar y cerrar", noHistory: "El historial está vacío", error: "Ocurrió un error en la búsqueda.", visitSite: "Visitar sitio / canal" },
  it: { subtitle: "Trova i posti, i canali e i contenuti più fantastici con l'IA", placeholder: "es., Podcast inglese, Un bar...", search: "Cerca", clearInput: "Cancella", settings: "Impostazioni", apiKeyLabel: "Chiave API Groq", langLabel: "Seleziona lingua", themeLabel: "Tema (Scuro/Chiaro)", historyLabel: "Cronologia ricerche", clearBtn: "Cancella cronologia", closeBtn: "Salva e chiudi", noHistory: "La cronologia è vuota", error: "Si è verificato un errore.", visitSite: "Visita il sito / canale" },
  pt: { subtitle: "Encontre os lugares, canais e recursos mais incríveis com IA", placeholder: "ex., Podcast de inglês, Um café...", search: "Pesquisar", clearInput: "Limpar", settings: "Configurações", apiKeyLabel: "Chave API Groq", langLabel: "Selecionar idioma", themeLabel: "Tema (Escuro/Claro)", historyLabel: "Histórico de pesquisa", clearBtn: "Limpar histórico", closeBtn: "Salvar e fechar", noHistory: "Histórico vazio", error: "Ocorreu um erro na pesquisa.", visitSite: "Visitar site / canal" },
  zh: { subtitle: "使用 AI 探索最棒的地方、频道和内容", placeholder: "例如：英语播客，咖啡馆...", search: "搜索", clearInput: "清除", settings: "设置", apiKeyLabel: "Groq API 密钥", langLabel: "选择语言", themeLabel: "主题（深色/浅色）", historyLabel: "搜索历史", clearBtn: "清除历史", closeBtn: "保存并关闭", noHistory: "历史记录为空", error: "搜索时发生错误。", visitSite: "访问网站/频道" },
  ja: { subtitle: "AIで周りの素晴らしい場所やチャンネル、コンテンツを見つけましょう", placeholder: "例：英語ポッドキャスト、カフェ...", search: "検索", clearInput: "クリア", settings: "設定", apiKeyLabel: "Groq API キー", langLabel: "言語を選択", themeLabel: "テーマ（ダーク/ライト）", historyLabel: "検索履歴", clearBtn: "履歴を消去", closeBtn: "保存して閉じる", noHistory: "履歴はありません", error: "検索中にエラーが発生しました。", visitSite: "サイト/チャンネルを見る" },
  ko: { subtitle: "AI로 주변의 멋진 장소, 채널, 콘텐츠를 찾아보세요", placeholder: "예: 영어 팟캐스트, 카페...", search: "검색", clearInput: "지우기", settings: "설정", apiKeyLabel: "Groq API 키", langLabel: "언어 선택", themeLabel: "테마 (다크/라이트)", historyLabel: "검색 기록", clearBtn: "기록 삭제", closeBtn: "저장 및 닫기", noHistory: "검색 기록이 없습니다", error: "검색 중 오류가 발생했습니다.", visitSite: "사이트 / 채널 방문" },
  ar: { subtitle: "اكتشف أروع الأماكن والقنوات والمحتوى باستخدام الذكاء الاصطناعي", placeholder: "مثال: بودكاست إنجليزي, مقهى...", search: "بحث", clearInput: "مسح", settings: "الإعدادات", apiKeyLabel: "مفتاح Groq API", langLabel: "اختر اللغة", themeLabel: "المظهر (داكن/فاتح)", historyLabel: "سجل البحث", clearBtn: "مسح السجل", closeBtn: "حفظ وإغلاق", noHistory: "السجل فارغ", error: "حدث خطأ أثناء البحث.", visitSite: "زيارة الموقع / القناة" },
  hi: { subtitle: "एआई के साथ बेहतरीन स्थान, चैनल और सामग्री खोजें", placeholder: "उदाहरण: अंग्रेजी पॉडकास्ट, कैफे...", search: "खोजें", clearInput: "साफ़ करें", settings: "सेटिंग्स", apiKeyLabel: "Groq API कुंजी", langLabel: "भाषा चुनें", themeLabel: "थीम (डार्क/लाइट)", historyLabel: "खोज इतिहास", clearBtn: "इतिहास साफ़ करें", closeBtn: "सहेजें और बंद करें", noHistory: "इतिहास खाली है", error: "खोज के दौरान त्रुटि हुई।", visitSite: "वेबसाइट / चैनल पर जाएं" },
  id: { subtitle: "Temukan tempat, saluran, dan konten paling menakjubkan dengan AI", placeholder: "contoh: Podcast Bahasa Inggris, Kafe...", search: "Cari", clearInput: "Bersihkan", settings: "Pengaturan", apiKeyLabel: "Kunci API Groq", langLabel: "Pilih Bahasa", themeLabel: "Tema (Gelap/Terang)", historyLabel: "Riwayat Pencarian", clearBtn: "Hapus Riwayat", closeBtn: "Simpan & Tutup", noHistory: "Riwayat kosong", error: "Terjadi kesalahan saat mencari.", visitSite: "Kunjungi Situs / Saluran" }
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "uz", name: "O'zbekcha" },
  { code: "ru", name: "Русский" },
  { code: "tr", name: "Türkçe" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "id", name: "Bahasa Indonesia" }
]

export default function SpotlyApp() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Place[]>([])
  const [error, setError] = useState<string | null>(null)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [lang, setLang] = useState("en") // Birinchi marta kirganda ingliz tili
  const [isDark, setIsDark] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setApiKey(localStorage.getItem("groqApiKey") || "")
    setLang(localStorage.getItem("appLang") || "en")
    
    const savedTheme = localStorage.getItem("appTheme")
    if (savedTheme) setIsDark(savedTheme === "dark")
    
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("groqApiKey", apiKey)
    localStorage.setItem("appLang", lang)
    localStorage.setItem("appTheme", isDark ? "dark" : "light")
    localStorage.setItem("searchHistory", JSON.stringify(history))
  }, [apiKey, lang, isDark, history, mounted])

  const handleSearch = async (e: React.FormEvent | string) => {
    if (typeof e !== "string") e.preventDefault()
    
    const searchQuery = typeof e === "string" ? e : query
    if (!searchQuery.trim()) return

    if (typeof e === "string") setQuery(e)

    setLoading(true)
    setResults([])
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, apiKey, lang }),
      })

      const rawText = await response.text()
      let data
      try {
        data = JSON.parse(rawText)
      } catch (pErr) {
        throw new Error("API xato javob qaytardi. Settings'dan Groq API Keyni tekshiring.")
      }

      if (!response.ok) {
        throw new Error(data.error || (T[lang] || T.en).error)
      }

      setResults(data.places || [])

      if (!history.includes(searchQuery.trim())) {
        setHistory(prev => [searchQuery.trim(), ...prev].slice(0, 10))
      }
    } catch (err: any) {
      console.error("[Spotly] Search error:", err)
      setError(err?.message || (T[lang] || T.en).error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null
  const t = T[lang] || T.en

  return (
    <main className={`min-h-screen flex flex-col items-center justify-start p-4 pt-20 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white shadow-md hover:bg-slate-100 text-slate-600'}`}
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="max-w-xl w-full text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-amber-500" />
          <h1 className="text-4xl font-extrabold tracking-tight">Spotly AI</h1>
        </div>
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>{t.subtitle}</p>

        {/* Input & Search + Clear */}
        <form 
          onSubmit={handleSearch} 
          className={`flex flex-col sm:flex-row gap-2 p-2 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className={`flex-1 bg-transparent px-4 py-2.5 outline-none w-full ${
              isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          
          <div className="flex items-center gap-1.5 justify-end">
            {query.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 transition text-sm shrink-0"
              >
                <X className="w-4 h-4" />
                {t.clearInput}
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition text-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t.search}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-left">
            {error}
          </p>
        )}

        <div className="space-y-4 text-left">
          {results.map((place, index) => (
            <div key={index} className={`p-5 rounded-xl space-y-3 border transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-xl font-bold text-amber-500">{place.name}</h3>
                <span className="flex shrink-0 items-center gap-1 text-sm bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full font-medium">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {place.rating}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <p className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <MapPin className="w-3.5 h-3.5" /> {place.category}
                </p>

                {place.price && (
                  <p className="flex items-center gap-1 text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <DollarSign className="w-3.5 h-3.5" /> {place.price}
                  </p>
                )}
              </div>

              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{place.description}</p>

              {place.link && (
                <div className="pt-2 border-t border-slate-500/10">
                  <a
                    href={place.link.startsWith("http") ? place.link : `https://${place.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-semibold underline underline-offset-4 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.visitSite}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl space-y-6 ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            
            <div className="flex justify-between items-center border-b pb-4 border-slate-500/20">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5" /> {t.settings}
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-500/20 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* API Key */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium opacity-80">{t.apiKeyLabel}</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className={`w-full p-2.5 rounded-lg border outline-none transition-colors ${isDark ? 'bg-slate-800 border-slate-700 focus:border-amber-500' : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-black'}`}
                />
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium opacity-80">{t.langLabel}</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-black'}`}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="text-black bg-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between py-1">
                <label className="text-sm font-medium opacity-80">{t.themeLabel}</label>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`p-2 rounded-lg flex items-center gap-2 transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-black'}`}
                >
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
              </div>

              {/* Search History */}
              <div className="pt-4 border-t border-slate-500/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium opacity-80 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {t.historyLabel}
                  </label>
                  {history.length > 0 && (
                    <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition">
                      <Trash2 className="w-3.5 h-3.5" /> {t.clearBtn}
                    </button>
                  )}
                </div>
                
                {history.length === 0 ? (
                  <p className="text-sm opacity-50 italic">{t.noHistory}</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleSearch(h)
                          setIsSettingsOpen(false)
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'}`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-3 mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition shadow-sm"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
