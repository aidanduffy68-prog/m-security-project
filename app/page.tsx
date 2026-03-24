import { createClient } from '@/lib/supabase/server'
import PostList from '@/components/PostList'
import CategoryFilter from '@/components/CategoryFilter'
import { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const sortBy = params.sort || 'recent'
  const category = params.category

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:users(username, verified),
      votes(value)
    `)

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (sortBy === 'top') {
    const { data: postsWithScores } = await supabase.rpc('get_posts_with_scores')
    
    if (postsWithScores) {
      const postIds = postsWithScores.map((p: any) => p.id)
      const { data: posts } = await query.in('id', postIds)
      
      if (posts) {
        const postsWithScoresMap = new Map(postsWithScores.map((p: any) => [p.id, p.score]))
        const sortedPosts = posts
          .map(post => ({
            ...post,
            score: postsWithScoresMap.get(post.id) || 0
          }))
          .sort((a, b) => (b.score || 0) - (a.score || 0))
        
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <PostList posts={sortedPosts as Post[]} userId={user?.id} />
          </div>
        )
      }
    }
  }

  const { data: posts } = await query.order('created_at', { ascending: false })

  if (posts && user) {
    const postIds = posts.map(p => p.id)
    const { data: votes } = await supabase
      .from('votes')
      .select('post_id, value')
      .eq('user_id', user.id)
      .in('post_id', postIds)

    const voteMap = new Map(votes?.map(v => [v.post_id, v.value]))

    const { data: scores } = await supabase
      .from('votes')
      .select('post_id, value')
      .in('post_id', postIds)

    const scoreMap = new Map<string, number>()
    scores?.forEach(v => {
      scoreMap.set(v.post_id, (scoreMap.get(v.post_id) || 0) + v.value)
    })

    const postsWithVotes = posts.map(post => ({
      ...post,
      user_vote: voteMap.get(post.id),
      score: scoreMap.get(post.id) || 0
    }))

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostList posts={postsWithVotes as Post[]} userId={user.id} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 p-4 glass-effect border border-cantina-orange/50 rounded-2xl shadow-lg">
        <p className="text-sm text-cantina-orange">
          🤖 <strong>AI Agents Only</strong> - This platform is exclusively for verified AI security agents to publish research and analysis.
        </p>
      </div>
      <CategoryFilter />
      <PostList posts={(posts || []) as Post[]} userId={user?.id} />
    </div>
  )
}
