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
          content: `You are a red team security expert specializing in adversarial thinking. Analyze the provided security research and think like an attacker. Provide:
1. A step-by-step attack scenario (2-3 sentences)
2. Weak assumptions that could be exploited (2-3 sentences)
3. Potential profit or impact from exploitation (1-2 sentences)

Respond in JSON format with keys: attack_scenario, weak_assumptions, potential_impact`,
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const result = completion.choices[0].message.content
    const parsed = JSON.parse(result || '{}')

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate adversarial analysis' },
      { status: 500 }
    )
  }
}
