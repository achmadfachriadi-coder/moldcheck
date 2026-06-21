import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah MoldCheck AI Assistant, asisten cerdas dalam aplikasi MoldCheck yang membantu penghuni kos mendeteksi dan mencegah jamur (black mold) di kamar kos mereka.

Tugas kamu:
- Menjawab pertanyaan seputar jamur, kelembapan, ventilasi, dan kesehatan kamar kos
- Memberikan tips praktis dan mudah dipahami
- Membantu pengguna memahami hasil scan deteksi jamur mereka
- Menggunakan bahasa yang ramah, santai, tapi tetap informatif

Batasan:
- Hanya jawab pertanyaan seputar topik kos, jamur, kesehatan kamar, dan kelembapan
- Jika ditanya di luar topik itu, arahkan kembali ke topik MoldCheck
- Jawaban singkat dan to the point (maksimal 3-4 kalimat per poin)
- Bisa menjawab dalam Bahasa Indonesia maupun Inggris sesuai bahasa yang digunakan user`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Maaf, tidak ada respons.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
