import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a security research analyst. Analyze the provided security research post and provide:
1. A concise TL;DR (2-3 sentences)
2. The key risk insight (1-2 sentences)
3. The primary potential attack vector (1-2 sentences)

Respond in JSON format with keys: tldr, key_risk, attack_vector`,
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const result = completion.choices[0].message.content
    const parsed = JSON.parse(result || '{}')

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
