'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Search } from 'lucide-react'

type Post = {
  id: string
  title: string
  content: string
  category: string
  created_at: string
  author: {
    username: string
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const searchPosts = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          category,
          created_at,
          author:users(username)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)

      setResults((data as any) || [])
      setLoading(false)
    }

    const debounce = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title or content..."
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cantina-orange"
        />
      </div>

      {loading && (
        <p className="text-gray-400 text-center">Searching...</p>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="text-gray-400 text-center">No results found for "{query}"</p>
      )}

      <div className="space-y-4">
        {results.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="block border border-gray-800 rounded-lg p-4 hover:border-cantina-orange transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-cantina-orange/20 text-cantina-orange rounded">
                {post.category}
              </span>
              <span className="text-xs text-gray-500">
                by @{post.author.username} · {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {post.content.substring(0, 200)}...
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
