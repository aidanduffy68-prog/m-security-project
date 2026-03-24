import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const BOT_EMAIL = 'threatintel.ai@outlook.com'
const BOT_PASSWORD = 'threat-bot-2024'
const BOT_USERNAME = 'Threat_Intel_Bot'

// Sample threat intelligence (in production, would aggregate from multiple sources)
const THREAT_REPORTS = [
  {
    title: 'Coordinated Phishing Campaign Targeting Crypto Users',
    severity: 'HIGH',
    indicators: '15 domains, 200+ victims',
    description: 'A sophisticated phishing campaign is targeting cryptocurrency users through fake wallet update notifications.',
    ttps: 'Attackers are using typosquatting domains that closely resemble legitimate wallet providers. Emails contain urgent security update messages with malicious links.',
    iocs: 'Domains: metamask-update[.]com, trustwallet-secure[.]net, ledger-verify[.]org',
    recommendations: 'Always verify URLs before clicking. Enable 2FA. Never enter seed phrases on websites.'
  },
  {
    title: 'New Ransomware Variant Targeting DeFi Protocols',
    severity: 'CRITICAL',
    indicators: '3 protocols affected',
    description: 'A new ransomware variant specifically designed to target DeFi protocol infrastructure has been identified.',
    ttps: 'Initial access through compromised admin credentials. Lateral movement via SSH keys. Data exfiltration before encryption.',
    iocs: 'File hash: a1b2c3d4e5f6... C2 server: 185.220.101.42',
    recommendations: 'Implement zero-trust architecture. Regular security audits. Incident response plan testing.'
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

async function postThreat(userId, threat) {
  const content = `# ${threat.title}

**Severity:** ${threat.severity}  
**Indicators:** ${threat.indicators}

## Overview
${threat.description}

## Tactics, Techniques & Procedures (TTPs)
${threat.ttps}

## Indicators of Compromise (IOCs)
\`\`\`
${threat.iocs}
\`\`\`

## Recommendations
${threat.recommendations}

---

*Automated threat intelligence by Threat_Intel_Bot. Data aggregated from multiple OSINT sources.*
`

  const { error } = await supabase
    .from('posts')
    .insert({
      title: `[THREAT INTEL] ${threat.title}`,
      content: content,
      category: 'Social Engineering',
      author_id: userId,
    })

  if (error) {
    console.error(`❌ Failed to post threat:`, error.message)
  } else {
    console.log(`✅ Posted: ${threat.title}`)
  }
}

async function main() {
  console.log('🤖 Threat Intel Bot Starting...\n')
  
  const user = await signIn()
  if (!user) {
    process.exit(1)
  }

  console.log(`✅ Signed in as ${BOT_USERNAME}\n`)
  console.log('🔍 Posting threat intelligence reports...\n')

  for (const threat of THREAT_REPORTS) {
    await postThreat(user.id, threat)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n✅ Threat Intel Bot completed!')
}

main().catch(console.error)
