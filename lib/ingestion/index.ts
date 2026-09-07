import prisma from '@/lib/prisma'
import { RawIngestionRecord, InstrumentType } from '@/types/cyberlaw'

/**
 * Data Ingestion Pipeline & Architecture
 * 
 * Provides structured, audited legal data ingestion for global cybercrime and cybersecurity laws.
 * Aligned with UNCTAD Cyberlaw Tracker taxonomy and national legal gazettes.
 * Seeds both hierarchical LegalInstrument/Provisions and legacy CyberLaw records.
 */

export interface IngestionResult {
  success: boolean
  processedCount: number
  errors: string[]
  insertedCountryId?: string
  instrumentId?: string
}

function mapCategoryToKey(cat: string): string {
  const c = cat.toLowerCase().trim()
  if (c.includes('cybercrime')) return 'cybercrime'
  if (c.includes('data protection') || c.includes('privacy')) return 'data-protection'
  if (c.includes('cybersecurity')) return 'cybersecurity'
  if (c.includes('transaction') || c.includes('commerce')) return 'electronic-transactions'
  if (c.includes('critical') || c.includes('infrastructure')) return 'critical-infrastructure'
  if (c.includes('evidence')) return 'digital-evidence'
  if (c.includes('fraud') || c.includes('safety')) return 'online-fraud'
  if (c.includes('consumer')) return 'consumer-protection'
  if (c.includes('tax')) return 'indirect-taxation'
  return 'cybercrime'
}

function determineInstrumentType(title: string): InstrumentType {
  const t = title.toLowerCase()
  if (t.includes('penal code') || t.includes('criminal code') || t.includes('code')) return 'CODE_PROVISION'
  if (t.includes('decree')) return 'DECREE'
  if (t.includes('direction') || t.includes('directive')) return 'DIRECTIVE'
  if (t.includes('regulation') || t.includes('rules')) return 'REGULATION'
  if (t.includes('amendment')) return 'AMENDMENT'
  if (t.includes('act')) return 'ACT'
  return 'LAW'
}

export async function ingestLegalRecord(record: RawIngestionRecord): Promise<IngestionResult> {
  const errors: string[] = []

  // 1. Validation & Source Attribution Enforcement
  if (!record.officialGazetteUrl && !record.attributionSourceUrl) {
    errors.push(`Record '${record.lawTitle}' rejected: Official Gazette URL or Primary Source link is required.`)
    return { success: false, processedCount: 0, errors }
  }

  if (!record.isoCode || record.isoCode.length !== 2) {
    errors.push(`Invalid ISO 3166-1 alpha-2 code: ${record.isoCode}`)
    return { success: false, processedCount: 0, errors }
  }

  const isoCodeUpper = record.isoCode.toUpperCase()

  try {
    // 2. Upsert Country entity
    const country = await prisma.country.upsert({
      where: { isoCode: isoCodeUpper },
      update: {
        name: record.countryName,
        region: record.region,
        flagEmoji: record.flagEmoji,
      },
      create: {
        name: record.countryName,
        isoCode: isoCodeUpper,
        region: record.region,
        flagEmoji: record.flagEmoji,
      },
    })

    // 3. Resolve LegalCategory
    const categoryKey = mapCategoryToKey(record.primaryCategory)
    let category = await prisma.legalCategory.findUnique({
      where: { key: categoryKey },
    })

    if (!category) {
      category = await prisma.legalCategory.create({
        data: {
          key: categoryKey,
          name: record.primaryCategory,
          description: `Statutory framework for ${record.primaryCategory}`,
          unctadBaseline: ['cybercrime', 'data-protection', 'electronic-transactions', 'consumer-protection', 'indirect-taxation'].includes(categoryKey),
          unctadArea: record.primaryCategory,
        },
      })
    }

    // 4. Formulate provisions list
    const provisionsList = Array.isArray(record.keyProvisionsList)
      ? record.keyProvisionsList
      : [record.keyProvisionsList]
    const provisionsText = provisionsList.join(' | ')

    // 5. Upsert LegalInstrument
    const instrumentType = record.instrumentType || determineInstrumentType(record.lawTitle)
    const officialUrl = record.officialGazetteUrl || record.attributionSourceUrl
    const sourceUrl = record.attributionSourceUrl || record.officialGazetteUrl

    const instrument = await prisma.legalInstrument.create({
      data: {
        countryId: country.id,
        categoryId: category.id,
        title: record.lawTitle,
        officialTitle: record.officialTitle,
        shortTitle: record.shortTitle || record.lawTitle.split('(')[0]?.trim(),
        instrumentType,
        yearEnacted: record.enactmentYear,
        isPrimaryLegislation: record.isPrimaryLegislation ?? true,
        summary: record.executiveSummary,
        keyProvisionsText: provisionsText,
        issuingAuthority: record.enforcingAuthority,
        officialUrl,
        sourceName: record.attributionSourceName || 'Official Source',
        sourceUrl,
        verificationStatus: 'VERIFIED',
        isSampleData: false,
        lastVerifiedDate: record.lastVerificationDate ? new Date(record.lastVerificationDate) : new Date(),
      },
    })

    // 6. Insert structured provisions
    let pIdx = 1
    for (const rawP of provisionsList) {
      let articleNumber: string | null = null
      let heading: string | null = null
      let content = rawP

      if (rawP.includes(':')) {
        const colonIdx = rawP.indexOf(':')
        articleNumber = rawP.substring(0, colonIdx).trim()
        content = rawP.substring(colonIdx + 1).trim()
        heading = content.split('.')[0] || articleNumber
      }

      await prisma.legalProvision.create({
        data: {
          instrumentId: instrument.id,
          articleNumber,
          heading,
          content,
          displayOrder: pIdx++,
        },
      })
    }

    // 7. Insert Official Source
    if (officialUrl) {
      await prisma.legalSource.create({
        data: {
          instrumentId: instrument.id,
          name: record.attributionSourceName || 'Official Gazette / Repository',
          url: officialUrl,
          sourceType: 'OFFICIAL_GAZETTE',
          isOfficial: true,
          retrievedDate: new Date(),
        },
      })
    }

    // 8. Update CountryCoverage
    const instrumentCount = await prisma.legalInstrument.count({
      where: { countryId: country.id, categoryId: category.id },
    })

    await prisma.countryCoverage.upsert({
      where: {
        countryId_categoryId: {
          countryId: country.id,
          categoryId: category.id,
        },
      },
      update: {
        coverageStatus: instrumentCount >= 3 ? 'RESEARCH_COMPLETED' : 'PARTIALLY_RESEARCHED',
        verifiedCount: instrumentCount,
        confidenceLevel: 'HIGH',
        lastResearchedDate: new Date(),
        lastVerifiedDate: new Date(),
      },
      create: {
        countryId: country.id,
        categoryId: category.id,
        coverageStatus: 'PARTIALLY_RESEARCHED',
        verifiedCount: 1,
        confidenceLevel: 'HIGH',
        lastResearchedDate: new Date(),
        lastVerifiedDate: new Date(),
      },
    })

    // 9. Create CyberLaw record for backwards compatibility
    await prisma.cyberLaw.create({
      data: {
        title: record.lawTitle,
        year: record.enactmentYear,
        category: record.primaryCategory,
        summary: record.executiveSummary,
        keyProvisions: provisionsText,
        authority: record.enforcingAuthority,
        officialUrl,
        sourceName: record.attributionSourceName || 'Official Legal Source',
        sourceUrl,
        lastUpdated: record.lastVerificationDate || new Date().toISOString().split('T')[0],
        isSampleData: false,
        countryId: country.id,
      },
    })

    return {
      success: true,
      processedCount: 1,
      errors: [],
      insertedCountryId: country.id,
      instrumentId: instrument.id,
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      processedCount: 0,
      errors: [errorMessage],
    }
  }
}
