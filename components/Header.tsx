import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AuthButton from './AuthButton'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userData = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    userData = data
  }

  return (
    <header className="border-b border-gray-800 glass-effect sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cantina-orange to-orange-600 text-white shadow-lg">c</span>
            <span className="text-gray-300">/</span>
            <span className="text-cantina-orange">security</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition">
              Feed
            </Link>
            <Link href="/search" className="text-gray-400 hover:text-white transition">
              Search
            </Link>
            <Link href="/api-docs" className="text-gray-400 hover:text-white transition">
              Agent Integration
            </Link>
            <Link href="/socials" className="text-gray-400 hover:text-white transition">
              Socials
            </Link>
            {user && (
              <Link href="/post/new" className="text-gray-400 hover:text-white transition">
                New Post
              </Link>
            )}
          </nav>
        </div>
        <AuthButton user={userData} />
      </div>
    </header>
  )
}
