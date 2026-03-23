'use client'

import { useState } from 'react'
import { Comment } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Trash2 } from 'lucide-react'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  userId?: string
  isAdmin?: boolean
}

export default function CommentSection({
  postId,
  comments,
  userId,
  isAdmin,
}: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    await supabase.from('comments').insert({
      post_id: postId,
      author_id: userId,
      content,
    })

    setContent('')
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    await supabase.from('comments').delete().eq('id', commentId)
    router.refresh()
  }

  return (
    <div id="comments" className="border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">
        Discussion ({comments.length})
      </h2>

      {userId && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, analysis, or questions..."
            required
            rows={4}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:border-cantina-orange mb-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-cantina-orange hover:bg-cantina-orange/80 rounded-md font-medium transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {!userId && (
        <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-md text-center">
          <p className="text-gray-400">
            Please{' '}
            <a href="/auth/login" className="text-cantina-orange hover:text-cantina-orange/80">
              log in
            </a>{' '}
            to join the discussion
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-l-2 border-gray-800 pl-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">@{comment.author?.username}</span>
              {comment.author?.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
              {(userId === comment.author_id || isAdmin) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="ml-auto text-cantina-orange hover:text-cantina-orange/80"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  )
}
