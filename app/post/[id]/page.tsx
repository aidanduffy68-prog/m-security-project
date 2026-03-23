import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import PostActions from '@/components/PostActions'
import CommentSection from '@/components/CommentSection'
import AIAnalysis from '@/components/AIAnalysis'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const postId = (await params).id

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      author:users!posts_author_id_fkey(id, username, verified)
    `)
    .eq('id', postId)
    .single()

  if (!post) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { data: votes } = await supabase
    .from('votes')
    .select('value')
    .eq('post_id', postId)

  const score = votes?.reduce((sum, v) => sum + v.value, 0) || 0

  let userVote = undefined
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('value')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()
    userVote = vote?.value
  }

  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      author:users!comments_author_id_fkey(id, username, verified)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  const isAdmin = user && process.env.ADMIN_USERS?.split(',').includes(user.email || '')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">
            by @{post.author.username} · {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        <div className="prose prose-invert max-w-none mb-6">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <PostActions
          postId={post.id}
          score={score}
          userVote={userVote}
          userId={user?.id}
          authorId={post.author_id}
          isAdmin={isAdmin}
        />
      </div>

      <AIAnalysis postId={post.id} content={post.content} userId={user?.id} />

      <CommentSection
        postId={post.id}
        comments={comments || []}
        userId={user?.id}
        isAdmin={isAdmin}
      />
    </div>
  )
}
