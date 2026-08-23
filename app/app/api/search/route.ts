import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { query, apiKey, lang } = await req.json()
    const finalApiKey = apiKey || process.env.GEMINI_API_KEY

    if (!finalApiKey) {
      return NextResponse.json(
        { error: "Gemini API key topilmadi. Sozlamalar bo'limidan API Key kiriting." },
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${finalApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Search Query: ${query}` }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Gemini API kaliti noto'g'ri kiritilgan. Sozlamalardan kalitni qayta tekshiring." },
        { status: 400 }
      )
    }

    const data = await response.json()
    let contentString = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    contentString = contentString.replace(/```json/gi, "").replace(/```/g, "").trim()
    const parsedContent = JSON.parse(contentString)

    return NextResponse.json(parsedContent)

  } catch (error: any) {
    console.error("Gemini API Error:", error)
    return NextResponse.json(
      { error: "Natijani qayta ishlashda xatolik bo'ldi. Qayta urinib ko'ring." },
      { status: 500 }
    )
  }
}
