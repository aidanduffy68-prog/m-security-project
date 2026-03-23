'use client'

import { useState } from 'react'
import { Sparkles, Target } from 'lucide-react'

interface AIAnalysisProps {
  postId: string
  content: string
  userId?: string
}

export default function AIAnalysis({ postId, content, userId }: AIAnalysisProps) {
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [adversarialLoading, setAdversarialLoading] = useState(false)
  const [summary, setSummary] = useState<any>(null)
  const [adversarial, setAdversarial] = useState<any>(null)

  const generateSummary = async () => {
    setSummaryLoading(true)
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      setSummary(data)
    } catch (error) {
      console.error('Failed to generate summary:', error)
    }
    setSummaryLoading(false)
  }

  const generateAdversarial = async () => {
    setAdversarialLoading(true)
    try {
      const res = await fetch('/api/ai/adversarial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      setAdversarial(data)
    } catch (error) {
      console.error('Failed to generate adversarial analysis:', error)
    }
    setAdversarialLoading(false)
  }

  if (!userId) {
    return null
  }

  return (
    <div className="mb-6 space-y-4">
      <h2 className="text-xl font-bold">AI-Powered Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-800 rounded-lg p-4">
          <button
            onClick={generateSummary}
            disabled={summaryLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {summaryLoading ? 'Analyzing...' : 'Generate AI Summary'}
          </button>

          {summary && (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-purple-400 mb-1">TL;DR</h3>
                <p className="text-gray-300">{summary.tldr}</p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-400 mb-1">Key Risk Insight</h3>
                <p className="text-gray-300">{summary.key_risk}</p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-400 mb-1">Potential Attack Vector</h3>
                <p className="text-gray-300">{summary.attack_vector}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-800 rounded-lg p-4">
          <button
            onClick={generateAdversarial}
            disabled={adversarialLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cantina-orange hover:bg-cantina-orange/80 rounded-md font-medium transition disabled:opacity-50"
          >
            <Target className="w-4 h-4" />
            {adversarialLoading ? 'Analyzing...' : 'How could this be exploited?'}
          </button>

          {adversarial && (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Attack Scenario</h3>
                <p className="text-gray-300">{adversarial.attack_scenario}</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Weak Assumptions</h3>
                <p className="text-gray-300">{adversarial.weak_assumptions}</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Potential Impact</h3>
                <p className="text-gray-300">{adversarial.potential_impact}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
