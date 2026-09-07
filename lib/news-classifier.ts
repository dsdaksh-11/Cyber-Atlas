/**
 * Deterministic Rule-Based Relevance Scoring, Categorization, and Threat Level Estimator
 * for AI + Cybersecurity News Articles.
 * 
 * Note: Designed to run without external paid AI APIs.
 * Includes hooks and structured output ready for future AI processing layers.
 */

export interface ClassificationResult {
  isRelevant: boolean
  relevanceScore: number
  category: string
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  aiConceptsFound: string[]
  cyberConceptsFound: string[]
}

// Keyword Taxonomies
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'llm', 'large language model', 'generative ai', 'genai',
  'ai agent', 'autonomous agent', 'chatbot', 'chatgpt', 'gpt-4', 'claude', 'gemini', 'copilot',
  'deepfake', 'machine learning', 'prompt injection', 'jailbreak', 'ai model', 'neural network',
  'rag', 'retrieval augmented generation', 'transformer model', 'diffusion model', 'synthetic media',
  'ai ecosystem', 'ai system', 'ai agentic'
]

const CYBER_KEYWORDS = [
  'cybersecurity', 'security', 'cyber attack', 'cyberattack', 'malware', 'ransomware',
  'phishing', 'vulnerability', 'exploit', 'data breach', 'threat', 'hacking', 'hacker',
  'cybercrime', 'sandbox', 'security research', 'zero-day', 'cve', 'backdoor', 'injection',
  'bypass', 'credential theft', 'exfiltration', 'infostealer', 'botnet', 'ddos', 'mitre',
  'privilege escalation', 'denial of service', 'unauthorized access'
]

interface ComboPhrase {
  phrase: string
  score: number
  category: string
  threat: 'Low' | 'Medium' | 'High' | 'Critical'
}

const COMBO_PHRASES: ComboPhrase[] = [
  { phrase: 'prompt injection', score: 40, category: 'Prompt Injection', threat: 'High' },
  { phrase: 'ai agent security', score: 40, category: 'AI Agent Security', threat: 'Medium' },
  { phrase: 'agent security', score: 35, category: 'AI Agent Security', threat: 'Medium' },
  { phrase: 'llm security', score: 35, category: 'LLM Security', threat: 'Medium' },
  { phrase: 'llm vulnerability', score: 40, category: 'LLM Security', threat: 'High' },
  { phrase: 'ai malware', score: 40, category: 'AI Malware', threat: 'High' },
  { phrase: 'ai-powered attack', score: 40, category: 'AI-Powered Attacks', threat: 'High' },
  { phrase: 'ai cyber attack', score: 40, category: 'AI-Powered Attacks', threat: 'High' },
  { phrase: 'deepfake threat', score: 35, category: 'Deepfake Threats', threat: 'Medium' },
  { phrase: 'deepfake scam', score: 40, category: 'Deepfake Threats', threat: 'High' },
  { phrase: 'ai jailbreak', score: 40, category: 'Prompt Injection', threat: 'High' },
  { phrase: 'ai vulnerability', score: 35, category: 'AI Vulnerabilities', threat: 'Medium' },
  { phrase: 'ai Regulation', score: 30, category: 'AI Cybersecurity Regulation', threat: 'Low' },
  { phrase: 'ai security research', score: 30, category: 'AI Security Research', threat: 'Low' },
  { phrase: 'ai sandbox', score: 35, category: 'AI Security Tools', threat: 'Low' },
]

const CRITICAL_KEYWORDS = [
  'active exploitation', 'critical vulnerability', 'ransomware campaign', 'mass breach',
  'weaponized ai', 'active attack', 'zero-day exploit', 'catastrophic', 'remote code execution',
  'widespread exploitation', 'emergency directive', 'national security threat'
]

const HIGH_KEYWORDS = [
  'exploit', 'malware', 'phishing campaign', 'major vulnerability', 'bypass', 'backdoor',
  'jailbreak', 'data exfiltration', 'infostealer', 'credential harvesting', 'severe risk',
  'unauthorized access', 'poisoning'
]

const MEDIUM_KEYWORDS = [
  'vulnerability', 'security concern', 'attack technique', 'exposure', 'risk', 'flaw',
  'misconfiguration', 'weakness', 'privacy concern'
]

export function classifyArticle(title: string, description: string): ClassificationResult {
  const text = `${title} ${description}`.toLowerCase()

  let score = 0
  const aiConceptsFound: string[] = []
  const cyberConceptsFound: string[] = []

  // Check AI Keywords
  for (const kw of AI_KEYWORDS) {
    if (text.includes(kw)) {
      aiConceptsFound.push(kw)
      score += kw.length > 3 ? 10 : 5
    }
  }

  // Check Cyber Keywords
  for (const kw of CYBER_KEYWORDS) {
    if (text.includes(kw)) {
      cyberConceptsFound.push(kw)
      score += kw.length > 3 ? 10 : 5
    }
  }

  // Check Combo Phrases
  let matchedComboCategory: string | null = null
  let matchedComboThreat: 'Low' | 'Medium' | 'High' | 'Critical' | null = null

  for (const combo of COMBO_PHRASES) {
    if (text.includes(combo.phrase)) {
      score += combo.score
      if (!matchedComboCategory) matchedComboCategory = combo.category
      if (!matchedComboThreat) matchedComboThreat = combo.threat
    }
  }

  // Must contain BOTH at least 1 AI concept AND at least 1 Cyber concept (or a combo phrase)
  const isRelevant = (aiConceptsFound.length > 0 && cyberConceptsFound.length > 0) || matchedComboCategory !== null
  const finalScore = isRelevant ? Math.min(100, score) : 0

  // Category determination
  let category = matchedComboCategory || 'General AI Security'
  if (!matchedComboCategory && isRelevant) {
    if (text.includes('agent') || text.includes('autonomous')) {
      category = 'AI Agent Security'
    } else if (text.includes('llm') || text.includes('large language model') || text.includes('gpt') || text.includes('claude')) {
      category = 'LLM Security'
    } else if (text.includes('prompt') || text.includes('jailbreak')) {
      category = 'Prompt Injection'
    } else if (text.includes('malware') || text.includes('ransomware') || text.includes('virus')) {
      category = 'AI Malware'
    } else if (text.includes('deepfake') || text.includes('voice cloning') || text.includes('synthetic video')) {
      category = 'Deepfake Threats'
    } else if (text.includes('vulnerability') || text.includes('cve') || text.includes('flaw')) {
      category = 'AI Vulnerabilities'
    } else if (text.includes('research') || text.includes('study') || text.includes('paper')) {
      category = 'AI Security Research'
    } else if (text.includes('regulation') || text.includes('act') || text.includes('policy') || text.includes('bill') || text.includes('compliance')) {
      category = 'AI Cybersecurity Regulation'
    } else if (text.includes('tool') || text.includes('defense') || text.includes('protection') || text.includes('scanner')) {
      category = 'AI Security Tools'
    } else if (text.includes('attack') || text.includes('phishing') || text.includes('hacked')) {
      category = 'AI-Powered Attacks'
    }
  }

  // Threat level determination
  let threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low'
  if (CRITICAL_KEYWORDS.some(kw => text.includes(kw))) {
    threatLevel = 'Critical'
  } else if (HIGH_KEYWORDS.some(kw => text.includes(kw)) || matchedComboThreat === 'High') {
    threatLevel = 'High'
  } else if (MEDIUM_KEYWORDS.some(kw => text.includes(kw)) || matchedComboThreat === 'Medium') {
    threatLevel = 'Medium'
  } else {
    threatLevel = 'Low'
  }

  return {
    isRelevant,
    relevanceScore: finalScore,
    category,
    threatLevel,
    aiConceptsFound,
    cyberConceptsFound,
  }
}
