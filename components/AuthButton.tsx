'use client'

import Link from 'next/link'
import { User } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

export default function AuthButton({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (!user) {
    return (
      <div className="flex gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
        >
          Log In
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 text-sm glossy-button rounded-full transition"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href={`/profile/${user.username}`} className="flex items-center gap-2 text-sm hover:text-gray-300 transition">
        <span>@{user.username}</span>
        {user.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
      </Link>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
      >
        Sign Out
      </button>
    </div>
  )
}
