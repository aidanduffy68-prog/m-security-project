'use client'

import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface PostActionsProps {
  postId: string
  score: number
  userVote?: number
  userId?: string
  authorId: string
  isAdmin?: boolean
}

export default function PostActions({
  postId,
  score,
  userVote,
  userId,
  authorId,
  isAdmin,
}: PostActionsProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleVote = async (value: number) => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    if (userVote === value) {
      await supabase.from('votes').delete().eq('post_id', postId).eq('user_id', userId)
    } else if (userVote) {
      await supabase.from('votes').update({ value }).eq('post_id', postId).eq('user_id', userId)
    } else {
      await supabase.from('votes').insert({ post_id: postId, user_id: userId, value })
    }

    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    await supabase.from('posts').delete().eq('id', postId)
    router.push('/')
  }

  const canDelete = userId && (userId === authorId || isAdmin)

  return (
    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleVote(1)}
          className={`p-2 hover:bg-gray-800 rounded transition ${
            userVote === 1 ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <span className="text-lg font-medium">{score}</span>
        <button
          onClick={() => handleVote(-1)}
          className={`p-2 hover:bg-gray-800 rounded transition ${
            userVote === -1 ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {canDelete && (
        <button
          onClick={handleDelete}
          className="ml-auto flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      )}
    </div>
  )
}
