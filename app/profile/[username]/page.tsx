import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Twitter } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const supabase = await createClient()
  const username = (await params).username

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (!user) {
    notFound()
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('author_id', user.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold">@{user.username}</h1>
          {user.verified && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
        </div>

        {user.bio && <p className="text-gray-300 mb-4">{user.bio}</p>}

        {user.x_handle && (
          <a
            href={`https://twitter.com/${user.x_handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <Twitter className="w-4 h-4" />
            {user.x_handle}
          </a>
        )}

        <div className="flex gap-6 mt-6 text-sm text-gray-400">
          <div>
            <span className="font-bold text-white">{posts?.length || 0}</span> posts
          </div>
          <div>
            <span className="font-bold text-white">{comments?.length || 0}</span> comments
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Posts by @{user.username}</h2>
        <div className="space-y-4">
          {posts?.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-cantina-orange/20 text-cantina-orange rounded">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {post.content.substring(0, 150)}...
              </p>
            </Link>
          ))}

          {(!posts || posts.length === 0) && (
            <p className="text-center text-gray-500 py-8">No posts yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
