import { NextResponse } from "next/server"

// Groq platformasining ayni vaqtda 100% ISHLAYDIGAN rasmiy modellari
const CANDIDATE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
  "llama3-8b-8192"
]

export async function POST(req: Request) {
  try {
    const { query, apiKey, lang } = await req.json()
    const finalApiKey = apiKey || process.env.GROQ_API_KEY

    if (!finalApiKey) {
      return NextResponse.json(
        { error: "Groq API key topilmadi. Settings bo'limidan API Key kiriting." },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a helpful travel, venue, media, and platform discovery assistant.
User query: "${query}".
Language code to respond in: "${lang || 'en'}".

Return ONLY a valid JSON object matching this exact structure without markdown backticks:
{
  "places": [
    {
      "name": "Name of venue, channel or platform",
      "category": "Category / Location",
      "rating": "4.8",
      "price": "Free / Paid",
      "link": "https://example.com",
      "description": "Short description in target language"
    }
  ]
}`

    let successfulResponseText = ""
    let lastError = ""

    // Har bir faol modelni birma-bir sinash
    for (const model of CANDIDATE_MODELS) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${finalApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: query },
            ],
            temperature: 0.2,
            max_tokens: 1000,
          }),
        })

        if (res.ok) {
          successfulResponseText = await res.text()
          break
        } else {
          const errText = await res.text()
          try {
            const parsed = JSON.parse(errText)
            // Agar model o'chirilgan bo'lsa, sikl to'xtamasdan keyingisiga o'tadi
            lastError = parsed.error?.message || errText
          } catch {
            lastError = errText
          }
        }
      } catch (e: any) {
        lastError = e?.message || "Fetch error"
      }
    }

    if (!successfulResponseText) {
      return NextResponse.json(
        { error: `Groq API bilan bog'lanishda xatolik: API Key noto'g mezoniga ega bo'lishi mumkin. (${lastError})` },
        { status: 400 }
      )
    }

    const data = JSON.parse(successfulResponseText)
    let contentString = data.choices[0]?.message?.content || ""

    // JSON matnini tozalash
    contentString = contentString.replace(/```json/gi, "").replace(/```/g, "").trim()
    const firstBrace = contentString.indexOf("{")
    const lastBrace = contentString.lastIndexOf("}")

    if (firstBrace !== -1 && lastBrace !== -1) {
      contentString = contentString.substring(firstBrace, lastBrace + 1)
    }

    const parsedContent = JSON.parse(contentString)
    return NextResponse.json(parsedContent)

  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Natijani qayta ishlashda xatolik bo'ldi. Qayta urinib ko'ring." },
      { status: 500 }
    )
  }
}
