export type Category = 
  | 'Smart Contract Exploits'
  | 'Oracle & Data Attacks'
  | 'Market Manipulation'
  | 'Social Engineering'
  | 'AI Security'
  | 'Infra / Web2 Security'
  | 'Zero-Day / Emerging Threats'

export const CATEGORIES: Category[] = [
  'Smart Contract Exploits',
  'Oracle & Data Attacks',
  'Market Manipulation',
  'Social Engineering',
  'AI Security',
  'Infra / Web2 Security',
  'Zero-Day / Emerging Threats',
]

export interface User {
  id: string
  username: string
  bio: string | null
  x_handle: string | null
  verified: boolean
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  category: Category
  author_id: string
  created_at: string
  author?: User
  score?: number
  user_vote?: number
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  author?: User
}

export interface Vote {
  id: string
  user_id: string
  post_id: string
  value: number
}

export interface AIAnalysis {
  tldr: string
  key_risk: string
  attack_vector: string
}

export interface AdversarialAnalysis {
  attack_scenario: string
  weak_assumptions: string
  potential_impact: string
}
