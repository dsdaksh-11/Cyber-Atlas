import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { normalizeCountryCode } from '@/lib/country-utils'

export const dynamic = 'force-dynamic'

export interface StandardCategory {
  categoryKey: string
  categoryName: string
  description: string
  aliases: string[]
}

export const COMPARISON_CATEGORIES: StandardCategory[] = [
  {
    categoryKey: 'cybercrime',
    categoryName: 'Cybercrime Legislation',
    description: 'Statutory provisions penalizing computer system intrusions, malware deployment, unauthorized access, and cyber sabotage.',
    aliases: ['cybercrime', 'computer crime', 'hacking', 'unauthorized access'],
  },
  {
    categoryKey: 'data-protection',
    categoryName: 'Data Protection',
    description: 'Comprehensive statutory frameworks regulating processing of personal data, consent, and individual data rights.',
    aliases: ['data protection', 'gdpr', 'personal data', 'privacy law'],
  },
  {
    categoryKey: 'privacy',
    categoryName: 'Privacy',
    description: 'Constitutional or statutory rights protecting personal privacy, surveillance limits, and digital identity rights.',
    aliases: ['privacy', 'personal privacy', 'habeas data', 'digital rights'],
  },
  {
    categoryKey: 'cybersecurity',
    categoryName: 'Cybersecurity Framework',
    description: 'National cybersecurity strategies, incident reporting mandates, standards, and regulatory supervisory authorities.',
    aliases: ['cybersecurity', 'network security', 'information security', 'cyber defense'],
  },
  {
    categoryKey: 'electronic-transactions',
    categoryName: 'Electronic Transactions / E-Commerce',
    description: 'Legal validity of electronic records, digital signatures, e-commerce, and cryptographic authentication.',
    aliases: ['electronic transactions', 'e-commerce', 'digital signatures', 'electronic commerce'],
  },
  {
    categoryKey: 'digital-evidence',
    categoryName: 'Digital Evidence',
    description: 'Rules governing admissibility, chain of custody, and forensic handling of electronic evidence in court.',
    aliases: ['digital evidence', 'electronic evidence', 'forensic evidence'],
  },
  {
    categoryKey: 'online-fraud',
    categoryName: 'Online Fraud',
    description: 'Legal sanctions targeting financial cyber scams, online identity theft, phishing, and digital extortion.',
    aliases: ['online fraud', 'cyber fraud', 'financial scam', 'phishing', 'online safety'],
  },
  {
    categoryKey: 'critical-infrastructure',
    categoryName: 'Critical Infrastructure Protection',
    description: 'Special security mandates protecting energy, health, finance, water, and transport information systems.',
    aliases: ['critical infrastructure', 'kritis', 'cii', 'essential services'],
  },
  {
    categoryKey: 'intellectual-property',
    categoryName: 'Intellectual Property in Digital Space',
    description: 'Copyright protection for software, digital trade secrets, domain names, and digital trademark enforcement.',
    aliases: ['intellectual property', 'digital copyright', 'software patent', 'trade secrets'],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countriesParam = searchParams.get('countries')

    if (!countriesParam) {
      return NextResponse.json(
        { error: 'Query parameter "countries" is required. Provide 2 to 4 comma-separated ISO codes (e.g. ?countries=IN,CN,US).' },
        { status: 400 }
      )
    }

    const rawCodes = countriesParam
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    if (rawCodes.length < 2 || rawCodes.length > 4) {
      return NextResponse.json(
        { error: 'Please select between 2 and 4 countries for comparison.' },
        { status: 400 }
      )
    }

    // Normalize codes
    const normalizedCodes = rawCodes.map(normalizeCountryCode)

    // Check for duplicates
    const uniqueCodes = Array.from(new Set(normalizedCodes))
    if (uniqueCodes.length !== normalizedCodes.length) {
      return NextResponse.json(
        { error: 'Duplicate country selected. Please select distinct countries.' },
        { status: 400 }
      )
    }

    // Fetch countries from DB
    const countries = await prisma.country.findMany({
      where: {
        isoCode: { in: uniqueCodes },
      },
      include: {
        laws: true,
      },
    })

    // Check if any country code was not found
    const foundIsoCodes = countries.map((c) => c.isoCode)
    const missingCodes = uniqueCodes.filter((code) => !foundIsoCodes.includes(code))

    if (missingCodes.length > 0) {
      return NextResponse.json(
        {
          error: `Country code(s) not found in database: ${missingCodes.join(', ')}.`,
          invalidCodes: missingCodes,
        },
        { status: 404 }
      )
    }

    // Maintain requested order
    const orderedCountries = uniqueCodes.map((code) => countries.find((c) => c.isoCode === code)!)

    // Build structured comparison response
    const categoryResults = COMPARISON_CATEGORIES.map((cat) => {
      const countryResults: Record<string, any> = {}

      orderedCountries.forEach((country) => {
        // Find laws matching category name or aliases
        const matchingLaws = country.laws.filter((law) => {
          const lCat = law.category.toLowerCase()
          const lTitle = law.title.toLowerCase()
          return cat.aliases.some((alias) => lCat.includes(alias) || lTitle.includes(alias))
        })

        if (matchingLaws.length > 0) {
          // Determine status based on laws
          const hasComprehensive = matchingLaws.some((l) => l.availabilityStatus === 'comprehensive')
          const hasSpecific = matchingLaws.some((l) => l.availabilityStatus === 'specific')
          const hasPartial = matchingLaws.some((l) => l.availabilityStatus === 'partial')

          let status = 'specific'
          let statusLabel = '✓ Specific legislation exists'

          if (hasComprehensive) {
            status = 'comprehensive'
            statusLabel = '✓ Comprehensive legislation'
          } else if (hasPartial) {
            status = 'partial'
            statusLabel = '⚠ Partial / sector-specific legislation'
          } else if (hasSpecific) {
            status = 'specific'
            statusLabel = '✓ Specific legislation exists'
          }

          countryResults[country.isoCode] = {
            status,
            statusLabel,
            hasLaw: true,
            laws: matchingLaws.map((l) => ({
              id: l.id,
              title: l.title,
              year: l.year,
              category: l.category,
              summary: l.summary,
              keyProvisions: l.keyProvisions,
              authority: l.authority,
              officialUrl: l.officialUrl,
              sourceName: l.sourceName,
              sourceUrl: l.sourceUrl,
              lastUpdated: l.lastUpdated,
              availabilityStatus: l.availabilityStatus,
            })),
          }
        } else {
          countryResults[country.isoCode] = {
            status: 'unavailable',
            statusLabel: '✕ Information not currently available in our database',
            hasLaw: false,
            laws: [],
          }
        }
      })

      return {
        categoryKey: cat.categoryKey,
        categoryName: cat.categoryName,
        description: cat.description,
        countryResults,
      }
    })

    return NextResponse.json({
      selectedCountries: orderedCountries.map((c) => ({
        id: c.id,
        name: c.name,
        isoCode: c.isoCode,
        region: c.region,
        flagEmoji: c.flagEmoji,
        lawCount: c.laws.length,
      })),
      categories: categoryResults,
    })
  } catch (error) {
    console.error('Error in /api/compare:', error)
    return NextResponse.json(
      { error: 'Internal Server Error while generating legal comparison matrix.' },
      { status: 500 }
    )
  }
}
