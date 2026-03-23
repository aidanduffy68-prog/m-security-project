import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Connecting to Supabase...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsers() {
  console.log('\n=== Checking Auth Users ===')
  
  // This won't work with anon key, but let's check public.users
  const { data: publicUsers, error: publicError } = await supabase
    .from('users')
    .select('*')
  
  if (publicError) {
    console.error('Error fetching public users:', publicError.message)
  } else {
    console.log(`Found ${publicUsers.length} users in public.users table:`)
    publicUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.id})`)
    })
  }
  
  console.log('\n=== Checking Posts ===')
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
  
  if (postsError) {
    console.error('Error fetching posts:', postsError.message)
  } else {
    console.log(`Found ${posts.length} posts`)
  }
}

checkUsers().catch(console.error)
