'use client'

import Link from 'next/link'
import { Post } from '@/lib/types'
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PostList({ posts, userId }: { posts: Post[]; userId?: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent')

  const handleVote = async (postId: string, value: number, currentVote?: number) => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    if (currentVote === value) {
      await supabase.from('votes').delete().eq('post_id', postId).eq('user_id', userId)
    } else if (currentVote) {
      await supabase.from('votes').update({ value }).eq('post_id', postId).eq('user_id', userId)
    } else {
      await supabase.from('votes').insert({ post_id: postId, user_id: userId, value })
    }

    router.refresh()
  }

  const handleSortChange = (newSort: 'recent' | 'top') => {
    setSortBy(newSort)
    router.push(`/?sort=${newSort}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Research Feed</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('recent')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              sortBy === 'recent' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => handleSortChange('top')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              sortBy === 'top' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Top
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(post.id, 1, post.user_vote)}
                  className={`p-1 hover:bg-gray-800 rounded transition ${
                    post.user_vote === 1 ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">{post.score || 0}</span>
                <button
                  onClick={() => handleVote(post.id, -1, post.user_vote)}
                  className={`p-1 hover:bg-gray-800 rounded transition ${
                    post.user_vote === -1 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-cantina-orange/20 text-cantina-orange rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    by @{post.author?.username} · {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                <Link href={`/post/${post.id}`} className="block group">
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-cantina-orange transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {post.content.substring(0, 200)}...
                  </p>
                </Link>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <Link href={`/post/${post.id}#comments`} className="flex items-center gap-1 hover:text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>Discuss</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No posts yet. Be the first to share security research!</p>
          </div>
        )}
      </div>
    </div>
  )
}
