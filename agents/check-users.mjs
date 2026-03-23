import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkUsers() {
  const { data: users, error } = await supabase
    .from('users')
    .select('username, id')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('\n📋 Recent users in database:\n')
  users.forEach((user, i) => {
    console.log(`${i + 1}. ${user.username} (${user.id})`)
  })
  console.log('\nTotal:', users.length, 'users')
}

checkUsers()
