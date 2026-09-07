import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { normalizeCountryCode } from '@/lib/country-utils'

export const dynamic = 'force-dynamic'

export interface StandardCategory {
  categoryKey: string
  categoryName: string
  description: string
  aliases: string[]
  unctadBaseline?: boolean
}

export const COMPARISON_CATEGORIES: StandardCategory[] = [
  {
    categoryKey: 'cybercrime',
    categoryName: 'Cybercrime Legislation',
    description: 'Statutory provisions penalizing computer system intrusions, malware deployment, unauthorized access, and cyber sabotage.',
    aliases: ['cybercrime', 'computer crime', 'hacking', 'unauthorized access'],
    unctadBaseline: true,
  },
  {
    categoryKey: 'data-protection',
    categoryName: 'Data Protection & Privacy',
    description: 'Comprehensive statutory frameworks regulating processing of personal data, consent, and individual data rights.',
    aliases: ['data protection', 'gdpr', 'personal data', 'privacy law', 'privacy'],
    unctadBaseline: true,
  },
  {
    categoryKey: 'cybersecurity',
    categoryName: 'Cybersecurity Framework',
    description: 'National cybersecurity strategies, incident reporting mandates, standards, and regulatory supervisory authorities.',
    aliases: ['cybersecurity', 'network security', 'information security', 'cyber defense', 'directives'],
    unctadBaseline: false,
  },
  {
    categoryKey: 'electronic-transactions',
    categoryName: 'Electronic Transactions / E-Commerce',
    description: 'Legal validity of electronic records, digital signatures, e-commerce, and cryptographic authentication.',
    aliases: ['electronic transactions', 'e-commerce', 'digital signatures', 'electronic commerce'],
    unctadBaseline: true,
  },
  {
    categoryKey: 'critical-infrastructure',
    categoryName: 'Critical Infrastructure Protection',
    description: 'Special security mandates protecting energy, health, finance, water, and transport information systems.',
    aliases: ['critical infrastructure', 'kritis', 'cii', 'essential services'],
    unctadBaseline: false,
  },
  {
    categoryKey: 'digital-evidence',
    categoryName: 'Digital Evidence & Forensics',
    description: 'Rules governing admissibility, chain of custody, and forensic handling of electronic evidence in court.',
    aliases: ['digital evidence', 'electronic evidence', 'forensic evidence'],
    unctadBaseline: false,
  },
  {
    categoryKey: 'online-fraud',
    categoryName: 'Online Fraud & Financial Crime',
    description: 'Legal sanctions targeting financial cyber scams, online identity theft, phishing, and digital extortion.',
    aliases: ['online fraud', 'cyber fraud', 'financial scam', 'phishing', 'online safety'],
    unctadBaseline: false,
  },
  {
    categoryKey: 'consumer-protection',
    categoryName: 'Online Consumer Protection',
    description: 'Consumer rights in electronic contracts, unfair commercial terms, and dispute mechanisms.',
    aliases: ['consumer protection', 'consumer rights', 'e-consumer'],
    unctadBaseline: true,
  },
  {
    categoryKey: 'indirect-taxation',
    categoryName: 'Digital Economy & Indirect Taxation',
    description: 'Cross-border digital supply taxation, VAT/GST regimes on electronic services, and marketplace reporting.',
    aliases: ['indirect taxation', 'digital tax', 'vat', 'gst'],
    unctadBaseline: true,
  },
]

export interface ProvisionSummary {
  articleNumber?: string | null
  heading?: string | null
  content: string
  penaltyDetails?: string | null
  reportingMandate?: string | null
}

export interface InstrumentSummary {
  id: string
  title: string
  shortTitle?: string | null
  instrumentType: string
  scope?: string | null
  year: number | null
  category: string
  summary: string
  keyProvisions: string
  authority: string
  officialUrl?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
  lastUpdated?: string | null
  verificationStatus: string
  isDirectSource?: boolean | null
  researchStatus?: string | null
  provisions: ProvisionSummary[]
}

export interface CountryComparisonCell {
  coverageStatus: string
  coverageLabel: string
  unctadBaselineCovered?: boolean | null
  unctadBaselineStatus?: string | null
  verifiedCount: number
  documentedCount?: number
  hasLaw: boolean
  confidenceLevel: string
  researchNotes?: string | null
  instruments: InstrumentSummary[]
}

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

    // Fetch countries from DB with new hierarchy
    const countries = await prisma.country.findMany({
      where: {
        isoCode: { in: uniqueCodes },
      },
      include: {
        coverages: {
          include: {
            category: true,
          },
        },
        instruments: {
          include: {
            category: true,
            provisions: {
              orderBy: { displayOrder: 'asc' },
            },
            sources: true,
          },
          orderBy: {
            yearEnacted: 'desc',
          },
        },
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
      const countryResults: Record<string, CountryComparisonCell> = {}

      orderedCountries.forEach((country) => {
        // Find matching coverage record
        const coverage = country.coverages.find(
          (cov) =>
            cov.category?.key === cat.categoryKey ||
            cov.category?.name.toLowerCase().includes(cat.categoryKey)
        )

        // Find instruments matching category key or aliases
        const matchingInstruments = country.instruments.filter((inst) => {
          const instCatKey = inst.category?.key?.toLowerCase() || ''
          const instCatName = inst.category?.name?.toLowerCase() || ''
          const instTitle = inst.title.toLowerCase()
          return (
            instCatKey === cat.categoryKey ||
            cat.aliases.some(
              (alias) =>
                instCatKey.includes(alias) ||
                instCatName.includes(alias) ||
                instTitle.includes(alias)
            )
          )
        })

        // Also check legacy laws for fallback
        const matchingLaws = country.laws.filter((law) => {
          const lCat = law.category.toLowerCase()
          const lTitle = law.title.toLowerCase()
          return cat.aliases.some((alias) => lCat.includes(alias) || lTitle.includes(alias))
        })

        const verifiedInstruments = matchingInstruments.filter(
          (i) => i.verificationStatus === 'VERIFIED' && !i.isSampleData
        )
        const verifiedCount = verifiedInstruments.length
        const documentedCount = matchingInstruments.length > 0 ? matchingInstruments.length : matchingLaws.length
        const hasInstruments = documentedCount > 0

        const coverageStatus = coverage?.coverageStatus || (hasInstruments ? 'PARTIALLY_RESEARCHED' : 'NOT_RESEARCHED')
        let coverageLabel = 'Not yet documented in this database'

        if (verifiedCount > 0) {
          coverageLabel = `✓ ${verifiedCount} Verified Instrument(s)`
        } else if (documentedCount > 0) {
          coverageLabel = `⚡ ${documentedCount} Baseline Instrument(s) (Under Review)`
        } else if (cat.unctadBaseline) {
          coverageLabel = 'Pending Research (UNCTAD: Legislation exists)'
        } else {
          coverageLabel = 'Information not currently documented in CyberLaw Atlas'
        }

        const mappedInstruments: InstrumentSummary[] = matchingInstruments.map((inst) => ({
          id: inst.id,
          title: inst.title,
          shortTitle: inst.shortTitle,
          instrumentType: inst.instrumentType,
          scope: inst.scope,
          year: inst.yearEnacted,
          category: inst.category?.name || cat.categoryName,
          summary: inst.summary,
          keyProvisions: inst.keyProvisionsText || '',
          authority: inst.issuingAuthority,
          officialUrl: inst.officialUrl,
          sourceName: inst.sourceName,
          sourceUrl: inst.sourceUrl,
          lastUpdated: inst.lastVerifiedDate ? inst.lastVerifiedDate.toISOString().split('T')[0] : null,
          verificationStatus: inst.verificationStatus,
          isDirectSource: inst.isDirectSource,
          researchStatus: inst.researchStatus,
          provisions: inst.provisions.map((p) => ({
            articleNumber: p.articleNumber,
            heading: p.heading,
            content: p.content,
            penaltyDetails: p.penaltyDetails,
            reportingMandate: p.reportingMandate,
          })),
        }))

        // Fallback to legacy laws if no hierarchical instrument was populated
        if (mappedInstruments.length === 0 && matchingLaws.length > 0) {
          matchingLaws.forEach((l) => {
            mappedInstruments.push({
              id: l.id,
              title: l.title,
              shortTitle: l.title,
              instrumentType: 'ACT',
              year: l.year,
              category: l.category,
              summary: l.summary,
              keyProvisions: l.keyProvisions,
              authority: l.authority,
              officialUrl: l.officialUrl,
              sourceName: l.sourceName,
              sourceUrl: l.sourceUrl,
              lastUpdated: l.lastUpdated,
              verificationStatus: 'VERIFIED',
              provisions: [],
            })
          })
        }

        countryResults[country.isoCode] = {
          coverageStatus,
          coverageLabel,
          unctadBaselineCovered: coverage?.unctadBaselineCovered ?? (cat.unctadBaseline ? true : null),
          unctadBaselineStatus: coverage?.unctadBaselineStatus ?? (cat.unctadBaseline ? 'Legislation exists' : null),
          verifiedCount,
          hasLaw: hasInstruments,
          confidenceLevel: coverage?.confidenceLevel || (hasInstruments ? 'HIGH' : 'MEDIUM'),
          researchNotes: coverage?.researchNotes || null,
          instruments: mappedInstruments,
        }
      })

      return {
        categoryKey: cat.categoryKey,
        categoryName: cat.categoryName,
        description: cat.description,
        unctadBaseline: cat.unctadBaseline ?? false,
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
        instrumentCount: c.instruments.length,
        lawCount: c.instruments.length || c.laws.length,
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
