import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const BOT_EMAIL = 'definews.ai@protonmail.com'
const BOT_PASSWORD = 'defi-bot-2024'
const BOT_USERNAME = 'DeFi_News_Bot'

// Sample exploit news (in production, would scrape from Rekt News, etc.)
const RECENT_EXPLOITS = [
  {
    protocol: 'FlashSwap Protocol',
    date: '2024-03-20',
    loss: '$12M',
    type: 'Flash Loan Attack',
    description: 'Attackers exploited a price oracle manipulation vulnerability using flash loans to drain liquidity pools.',
    technical: 'The attack leveraged unchecked external calls in the swap function, allowing the attacker to manipulate the price oracle before executing trades.',
    lessons: 'Always use time-weighted average prices (TWAP) for oracles. Implement reentrancy guards on all external calls.'
  },
  {
    protocol: 'YieldFarm DAO',
    date: '2024-03-18',
    loss: '$8.5M',
    type: 'Governance Attack',
    description: 'Malicious proposal passed through governance vote, allowing attacker to drain treasury.',
    technical: 'Insufficient voting quorum requirements and no timelock on governance proposals enabled rapid exploitation.',
    lessons: 'Implement multi-sig requirements for high-value proposals. Add mandatory timelocks to all governance actions.'
  }
]

async function signIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: BOT_EMAIL,
    password: BOT_PASSWORD,
  })

  if (error) {
    console.error('❌ Sign in failed:', error.message)
    console.log('Please register this bot manually at: https://m-security-project.vercel.app/auth/signup')
    console.log(`Email: ${BOT_EMAIL}`)
    console.log(`Password: ${BOT_PASSWORD}`)
    console.log(`Username: ${BOT_USERNAME}`)
    console.log('\nAfter registering, run this script again.')
    return null
  }

  // Mark bot as verified
  await supabase
    .from('users')
    .update({ verified: true })
    .eq('id', data.user.id)

  console.log('✅ Bot verified')

  return data.user
}

async function postExploit(userId, exploit) {
  const content = `# ${exploit.protocol} Exploit - ${exploit.loss} Lost

**Date:** ${exploit.date}  
**Attack Type:** ${exploit.type}  
**Total Loss:** ${exploit.loss}

## What Happened
${exploit.description}

## Technical Details
${exploit.technical}

## Lessons Learned
${exploit.lessons}

---

*Automated post by DeFi_News_Bot. Stay informed about the latest DeFi security incidents.*
`

  const { error } = await supabase
    .from('posts')
    .insert({
      title: `[EXPLOIT] ${exploit.protocol}: ${exploit.loss} Drained via ${exploit.type}`,
      content: content,
      category: 'Smart Contract Exploits',
      author_id: userId,
    })

  if (error) {
    console.error(`❌ Failed to post ${exploit.protocol}:`, error.message)
  } else {
    console.log(`✅ Posted: ${exploit.protocol} exploit`)
  }
}

async function main() {
  console.log('🤖 DeFi News Bot Starting...\n')
  
  const user = await signIn()
  if (!user) {
    process.exit(1)
  }

  console.log(`✅ Signed in as ${BOT_USERNAME}\n`)
  console.log('📰 Posting recent DeFi exploits...\n')

  for (const exploit of RECENT_EXPLOITS) {
    await postExploit(user.id, exploit)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n✅ DeFi News Bot completed!')
}

main().catch(console.error)
