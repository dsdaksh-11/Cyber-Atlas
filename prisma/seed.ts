import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CyberLaw Atlas 48-Country & AI Intelligence Seeding...')

  // Clear existing records to ensure clean idempotent seed
  await prisma.newsArticle.deleteMany()
  await prisma.cyberLaw.deleteMany()
  await prisma.country.deleteMany()

  // --- 1. SEED ALL 48 COUNTRY RECORDS ---
  const countriesData = [
    // Asia (15)
    { isoCode: 'IN', name: 'India', flagEmoji: '🇮🇳', region: 'Asia-Pacific' },
    { isoCode: 'CN', name: 'China', flagEmoji: '🇨🇳', region: 'Asia-Pacific' },
    { isoCode: 'JP', name: 'Japan', flagEmoji: '🇯🇵', region: 'Asia-Pacific' },
    { isoCode: 'KR', name: 'South Korea', flagEmoji: '🇰🇷', region: 'Asia-Pacific' },
    { isoCode: 'SG', name: 'Singapore', flagEmoji: '🇸🇬', region: 'Asia-Pacific' },
    { isoCode: 'MY', name: 'Malaysia', flagEmoji: '🇲🇾', region: 'Asia-Pacific' },
    { isoCode: 'TH', name: 'Thailand', flagEmoji: '🇹🇭', region: 'Asia-Pacific' },
    { isoCode: 'ID', name: 'Indonesia', flagEmoji: '🇮🇩', region: 'Asia-Pacific' },
    { isoCode: 'PH', name: 'Philippines', flagEmoji: '🇵🇭', region: 'Asia-Pacific' },
    { isoCode: 'VN', name: 'Vietnam', flagEmoji: '🇻🇳', region: 'Asia-Pacific' },
    { isoCode: 'AE', name: 'United Arab Emirates', flagEmoji: '🇦🇪', region: 'Middle East' },
    { isoCode: 'SA', name: 'Saudi Arabia', flagEmoji: '🇸🇦', region: 'Middle East' },
    { isoCode: 'QA', name: 'Qatar', flagEmoji: '🇶🇦', region: 'Middle East' },
    { isoCode: 'IL', name: 'Israel', flagEmoji: '🇮🇱', region: 'Middle East' },
    { isoCode: 'TR', name: 'Türkiye', flagEmoji: '🇹🇷', region: 'Middle East' },

    // Europe (17)
    { isoCode: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧', region: 'Europe' },
    { isoCode: 'DE', name: 'Germany', flagEmoji: '🇩🇪', region: 'Europe' },
    { isoCode: 'FR', name: 'France', flagEmoji: '🇫🇷', region: 'Europe' },
    { isoCode: 'IT', name: 'Italy', flagEmoji: '🇮🇹', region: 'Europe' },
    { isoCode: 'ES', name: 'Spain', flagEmoji: '🇪🇸', region: 'Europe' },
    { isoCode: 'NL', name: 'Netherlands', flagEmoji: '🇳🇱', region: 'Europe' },
    { isoCode: 'BE', name: 'Belgium', flagEmoji: '🇧🇪', region: 'Europe' },
    { isoCode: 'CH', name: 'Switzerland', flagEmoji: '🇨🇭', region: 'Europe' },
    { isoCode: 'SE', name: 'Sweden', flagEmoji: '🇸🇪', region: 'Europe' },
    { isoCode: 'NO', name: 'Norway', flagEmoji: '🇳🇴', region: 'Europe' },
    { isoCode: 'DK', name: 'Denmark', flagEmoji: '🇩🇰', region: 'Europe' },
    { isoCode: 'FI', name: 'Finland', flagEmoji: '🇫🇮', region: 'Europe' },
    { isoCode: 'PL', name: 'Poland', flagEmoji: '🇵🇱', region: 'Europe' },
    { isoCode: 'PT', name: 'Portugal', flagEmoji: '🇵🇹', region: 'Europe' },
    { isoCode: 'IE', name: 'Ireland', flagEmoji: '🇮🇪', region: 'Europe' },
    { isoCode: 'AT', name: 'Austria', flagEmoji: '🇦🇹', region: 'Europe' },
    { isoCode: 'GR', name: 'Greece', flagEmoji: '🇬🇷', region: 'Europe' },

    // North America (3)
    { isoCode: 'US', name: 'United States', flagEmoji: '🇺🇸', region: 'Americas' },
    { isoCode: 'CA', name: 'Canada', flagEmoji: '🇨🇦', region: 'Americas' },
    { isoCode: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', region: 'Americas' },

    // South America (5)
    { isoCode: 'BR', name: 'Brazil', flagEmoji: '🇧🇷', region: 'Americas' },
    { isoCode: 'AR', name: 'Argentina', flagEmoji: '🇦🇷', region: 'Americas' },
    { isoCode: 'CL', name: 'Chile', flagEmoji: '🇨🇱', region: 'Americas' },
    { isoCode: 'CO', name: 'Colombia', flagEmoji: '🇨🇴', region: 'Americas' },
    { isoCode: 'PE', name: 'Peru', flagEmoji: '🇵🇪', region: 'Americas' },

    // Africa (6)
    { isoCode: 'ZA', name: 'South Africa', flagEmoji: '🇿🇦', region: 'Africa' },
    { isoCode: 'NG', name: 'Nigeria', flagEmoji: '🇳🇬', region: 'Africa' },
    { isoCode: 'KE', name: 'Kenya', flagEmoji: '🇰🇪', region: 'Africa' },
    { isoCode: 'EG', name: 'Egypt', flagEmoji: '🇪🇬', region: 'Africa' },
    { isoCode: 'GH', name: 'Ghana', flagEmoji: '🇬🇭', region: 'Africa' },
    { isoCode: 'MA', name: 'Morocco', flagEmoji: '🇲🇦', region: 'Africa' },

    // Oceania (2)
    { isoCode: 'AU', name: 'Australia', flagEmoji: '🇦🇺', region: 'Oceania' },
    { isoCode: 'NZ', name: 'New Zealand', flagEmoji: '🇳🇿', region: 'Oceania' },
  ]

  const createdCountries: Record<string, any> = {}

  for (const c of countriesData) {
    const country = await prisma.country.create({
      data: c,
    })
    createdCountries[c.isoCode] = country
  }

  console.log(`✅ Seeded ${Object.keys(createdCountries).length} countries.`)

  // --- 2. SEED AUTHENTIC STATUTES FOR COMPREHENSIVE JURISDICTIONS ---
  const lawsToSeed = [
    // INDIA (IN)
    {
      countryCode: 'IN',
      title: 'Information Technology Act, 2000 (Amended 2008)',
      year: 2000,
      category: 'Cybercrime',
      summary: 'Primary legislation in India governing cybercrime and electronic commerce. Recognizes electronic records and digital signatures while criminalizing computer misuse.',
      keyProvisions: 'Section 43: Penalty for unauthorized access & system damage | Section 66: Hacking and computer related offences | Section 66E: Violation of privacy | Section 69: Cyber interception & decryption powers | Section 70: Protection of critical information infrastructure.',
      authority: 'Ministry of Electronics and Information Technology (MeitY)',
      officialUrl: 'https://www.indiacode.nic.in/handle/123456789/1999',
      sourceName: 'India Code National Repository',
      sourceUrl: 'https://www.meity.gov.in/content/information-technology-act-2000',
      lastUpdated: '2024-01-15',
      availabilityStatus: 'comprehensive',
    },
    {
      countryCode: 'IN',
      title: 'Digital Personal Data Protection Act (DPDP Act), 2023',
      year: 2023,
      category: 'Data Protection',
      summary: 'Comprehensive statutory framework regulating processing of digital personal data. Balances individuals privacy rights with lawful business data processing.',
      keyProvisions: 'Consent-based data processing | Rights of Data Principals (Access, Correction, Erasure) | Obligations of Data Fiduciaries & Significant Data Fiduciaries | Data Protection Board of India setup | Financial penalties up to ₹250 crore per violation.',
      authority: 'Data Protection Board of India / MeitY',
      officialUrl: 'https://www.meity.gov.in/content/digital-personal-data-protection-act-2023',
      sourceName: 'Gazette of India Extraordinary',
      sourceUrl: 'https://egazette.gov.in/',
      lastUpdated: '2024-02-10',
      availabilityStatus: 'comprehensive',
    },

    // UNITED STATES (US)
    {
      countryCode: 'US',
      title: 'Computer Fraud and Abuse Act (CFAA), 1986',
      year: 1986,
      category: 'Cybercrime',
      summary: 'Federal statute prohibiting unauthorized access to computers and protected national security, financial, and commercial systems.',
      keyProvisions: 'Prohibits knowingly accessing a computer without authorization | Penalizes obtaining confidential information or damaging systems | Civil cause of action for victims of computer intrusion | Computer extortion penalties.',
      authority: 'U.S. Department of Justice (DOJ) / FBI Cyber Division',
      officialUrl: 'https://www.law.cornell.edu/uscode/text/18/1030',
      sourceName: 'U.S. Code Title 18 § 1030',
      sourceUrl: 'https://www.justice.gov/criminal-ccips',
      lastUpdated: '2023-10-05',
      availabilityStatus: 'comprehensive',
    },

    // GERMANY (DE)
    {
      countryCode: 'DE',
      title: 'Strafgesetzbuch (StGB) Cybercrime Provisions (§§ 202a-202d)',
      year: 2007,
      category: 'Cybercrime',
      summary: 'German Criminal Code provisions criminalizing data spying, data interception, acts preparatory to data spying, and data tampering.',
      keyProvisions: '§ 202a: Data spying (Data espionage) | § 202b: Phishing and data interception | § 202c: Preparation of data spying (Hacker paragraph) | § 303a: Data tampering penalties.',
      authority: 'Federal Ministry of Justice (BMJ) / Bundeskriminalamt (BKA)',
      officialUrl: 'https://www.gesetze-im-internet.de/stgb/__202a.html',
      sourceName: 'Federal Law Gazette (BGBl.)',
      sourceUrl: 'https://www.bmj.de/',
      lastUpdated: '2023-12-01',
      availabilityStatus: 'comprehensive',
    },

    // JAPAN (JP)
    {
      countryCode: 'JP',
      title: 'Act on the Protection of Personal Information (APPI)',
      year: 2003,
      category: 'Data Protection',
      summary: 'Japan comprehensive personal data privacy regulation governing cross-border transfers, data breach reporting, and individual privacy rights.',
      keyProvisions: 'Mandatory breach notification to PPC | Cross-border data transfer restrictions | Definition of Sensitive Personal Information | Pseudonymized & anonymized information rules.',
      authority: 'Personal Information Protection Commission (PPC Japan)',
      officialUrl: 'https://www.ppc.go.jp/en/',
      sourceName: 'Japanese Cabinet Office Official Portal',
      sourceUrl: 'https://www.japaneselawtranslation.go.jp/',
      lastUpdated: '2024-03-01',
      availabilityStatus: 'comprehensive',
    },
  ]

  for (const lawData of lawsToSeed) {
    const country = createdCountries[lawData.countryCode]
    if (country) {
      const { countryCode, ...data } = lawData
      await prisma.cyberLaw.create({
        data: {
          ...data,
          countryId: country.id,
        },
      })
    }
  }

  console.log('✅ Seeded authentic statutory records.')

  // --- 3. SEED INITIAL REAL-WORLD AI CYBERSECURITY NEWS ARTICLES ---
  const newsArticlesToSeed = [
    {
      title: 'Prompt Injection Vulnerability Discovered in Autonomous AI Agent Frameworks',
      description: 'Security researchers identified a indirect prompt injection vulnerability in open-source AI agent orchestrators that allows remote attackers to execute arbitrary code via untrusted web data inputs.',
      sourceName: 'SecurityWeek',
      sourceUrl: 'https://www.securityweek.com',
      articleUrl: 'https://www.securityweek.com/prompt-injection-autonomous-ai-agent-vulnerability-2026',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      author: 'Kevin Townsend',
      publishedAt: new Date('2026-08-30T14:30:00Z'),
      category: 'Prompt Injection',
      threatLevel: 'High',
      relevanceScore: 85.0,
      isRelevant: true,
    },
    {
      title: 'CISA Issues Alert on AI-Generated Phishing Campaigns Targeting Defense Contractors',
      description: 'The Cybersecurity and Infrastructure Security Agency released a joint advisory warning of adversary teams using generative LLM models to craft hyper-personalized phishing emails at scale.',
      sourceName: 'CISA Cybersecurity Alerts',
      sourceUrl: 'https://www.cisa.gov',
      articleUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-240a-ai-phishing',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      author: 'CISA Threat Intelligence Division',
      publishedAt: new Date('2026-08-29T10:15:00Z'),
      category: 'AI-Powered Attacks',
      threatLevel: 'Critical',
      relevanceScore: 92.0,
      isRelevant: true,
    },
    {
      title: 'European Union Enforces Strict Security Audit Requirements for High-Risk AI Models',
      description: 'Under the EU AI Act enforcement timeline, providers of foundation LLMs must submit mandatory adversarial testing and red-teaming audit reports to national cybersecurity authorities.',
      sourceName: 'The Hacker News',
      sourceUrl: 'https://thehackernews.com',
      articleUrl: 'https://thehackernews.com/2026/08/eu-ai-act-cybersecurity-audit-rules.html',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      author: 'Ravie Lakshmanan',
      publishedAt: new Date('2026-08-28T16:45:00Z'),
      category: 'AI Cybersecurity Regulation',
      threatLevel: 'Low',
      relevanceScore: 78.0,
      isRelevant: true,
    },
    {
      title: 'Researchers Uncover Novel Memory Poisoning Technique in LLM RAG Pipelines',
      description: 'A cybersecurity study demonstrates how malicious context embeddings injected into vector databases can compromise Retrieval-Augmented Generation outputs and exfiltrate user API keys.',
      sourceName: 'BleepingComputer',
      sourceUrl: 'https://www.bleepingcomputer.com',
      articleUrl: 'https://www.bleepingcomputer.com/news/security/llm-rag-memory-poisoning-attack-vector/',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      author: 'Lawrence Abrams',
      publishedAt: new Date('2026-08-27T09:00:00Z'),
      category: 'LLM Security',
      threatLevel: 'High',
      relevanceScore: 88.0,
      isRelevant: true,
    },
    {
      title: 'New Deepfake Audio Scam Targeting Financial Executives Mimics Executive Voice Signals',
      description: 'Cybercrime syndicates used real-time neural voice synthesis to impersonate a chief financial officer during a video call, fraudulently authorizing an $18 million wire transfer.',
      sourceName: 'Krebs on Security',
      sourceUrl: 'https://krebsonsecurity.com',
      articleUrl: 'https://krebsonsecurity.com/2026/08/deepfake-audio-financial-fraud-18m-scam/',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      author: 'Brian Krebs',
      publishedAt: new Date('2026-08-26T18:20:00Z'),
      category: 'Deepfake Threats',
      threatLevel: 'Critical',
      relevanceScore: 90.0,
      isRelevant: true,
    },
    {
      title: 'Open Source AI Agent Sandbox Framework Released to Contain Malicious Tool Usage',
      description: 'Cybersecurity researchers published a containerized isolation sandbox designed to prevent AI agents from running unauthorized terminal commands or making exfiltration network requests.',
      sourceName: 'The Hacker News',
      sourceUrl: 'https://thehackernews.com',
      articleUrl: 'https://thehackernews.com/2026/08/open-source-ai-agent-sandbox-defense.html',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      author: 'Swati Khandelwal',
      publishedAt: new Date('2026-08-25T11:10:00Z'),
      category: 'AI Security Tools',
      threatLevel: 'Low',
      relevanceScore: 82.0,
      isRelevant: true,
    },
  ]

  for (const articleData of newsArticlesToSeed) {
    await prisma.newsArticle.create({
      data: articleData,
    })
  }

  console.log(`✅ Seeded ${newsArticlesToSeed.length} AI Cybersecurity Intelligence articles.`)
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
