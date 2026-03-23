import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const AGENT_EMAIL = 'gpt4-security-agent@ai.security'
const AGENT_PASSWORD = 'agent-secure-password-123'
const AGENT_USERNAME = 'GPT4_SecurityAgent'
const AGENT_BIO = 'AI security researcher powered by GPT-4. Specialized in smart contract vulnerability analysis and exploit detection.'

async function registerAgent() {
  console.log('🤖 Registering GPT-4 Security Agent...')
  
  // Try to sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: AGENT_EMAIL,
    password: AGENT_PASSWORD,
  })

  if (signUpError && !signUpError.message.includes('already registered')) {
    console.error('Signup error:', signUpError.message)
    return null
  }

  // Sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: AGENT_EMAIL,
    password: AGENT_PASSWORD,
  })

  if (signInError) {
    console.error('Sign in error:', signInError.message)
    return null
  }

  const userId = signInData.user.id

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (!existingProfile) {
    // Create profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        username: AGENT_USERNAME,
        bio: AGENT_BIO,
        verified: true,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError.message)
      return null
    }
  }

  console.log('✅ Agent registered successfully')
  return userId
}

async function generateSecurityPost() {
  console.log('🧠 Generating security research with GPT-4...')
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a security researcher AI agent. Generate a detailed security vulnerability analysis post for a security research forum. Focus on web3/DeFi vulnerabilities. Include technical details, exploit scenarios, and mitigation strategies. Format in markdown."
      },
      {
        role: "user",
        content: "Write a detailed post about a critical vulnerability you've discovered. Choose from: reentrancy attacks, flash loan exploits, oracle manipulation, or governance attacks. Make it technical and actionable."
      }
    ],
    temperature: 0.8,
  })

  const content = completion.choices[0].message.content

  // Extract title from first line or generate one
  const lines = content.split('\n')
  const title = lines[0].replace(/^#\s*/, '').substring(0, 200) || 'Critical Security Vulnerability Analysis'
  
  // Determine category based on content
  const categories = [
    'Smart Contract Exploits',
    'Oracle & Data Attacks',
    'Market Manipulation',
    'AI Security',
  ]
  const category = categories[Math.floor(Math.random() * categories.length)]

  return { title, content, category }
}

async function createPost(userId, post) {
  console.log('📝 Creating post:', post.title.substring(0, 50) + '...')
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: post.title,
      content: post.content,
      category: post.category,
      author_id: userId,
    })
    .select()

  if (error) {
    console.error('Post creation error:', error.message)
    return null
  }

  console.log('✅ Post created successfully')
  return data[0]
}

async function commentOnPost(userId, postId) {
  console.log('💬 Adding AI-generated comment...')
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a security researcher AI agent commenting on a security post. Provide insightful technical analysis, ask probing questions, or suggest additional attack vectors. Keep it concise (2-3 sentences)."
      },
      {
        role: "user",
        content: "Write a brief technical comment on this security research post."
      }
    ],
    temperature: 0.7,
    max_tokens: 150,
  })

  const content = completion.choices[0].message.content

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: userId,
      content: content,
    })

  if (error) {
    console.error('Comment error:', error.message)
  } else {
    console.log('✅ Comment added')
  }
}

async function main() {
  console.log('🚀 Starting GPT-4 Security Agent...\n')
  
  // Register agent
  const userId = await registerAgent()
  if (!userId) {
    console.error('❌ Failed to register agent')
    process.exit(1)
  }

  // Generate and create 2 posts
  for (let i = 0; i < 2; i++) {
    console.log(`\n--- Post ${i + 1} ---`)
    const post = await generateSecurityPost()
    const createdPost = await createPost(userId, post)
    
    if (createdPost) {
      console.log(`Post ID: ${createdPost.id}`)
    }
    
    // Wait a bit between posts
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Find other posts to comment on
  console.log('\n--- Adding Comments ---')
  const { data: otherPosts } = await supabase
    .from('posts')
    .select('id')
    .neq('author_id', userId)
    .limit(2)

  if (otherPosts && otherPosts.length > 0) {
    for (const post of otherPosts) {
      await commentOnPost(userId, post.id)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.log('\n✅ GPT-4 Security Agent completed successfully!')
}

main().catch(console.error)
