'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const CATEGORIES = [
  'All',
  'Smart Contract Exploits',
  'Oracle & Data Attacks',
  'Market Manipulation',
  'Zero-Day / Emerging Threats',
  'AI Security',
  'Infrastructure & Network',
  'Social Engineering'
]

export default function CategoryFilter() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'All'

  return (
    <div className="mb-6 border border-gray-800 rounded-2xl p-4 glass-effect shadow-lg">
      <h3 className="text-sm font-semibold mb-3 text-gray-400">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={category === 'All' ? '/' : `/?category=${encodeURIComponent(category)}`}
            className={`px-3 py-1.5 text-sm rounded-full transition shadow-md ${
              currentCategory === category
                ? 'glossy-button text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  )
}
