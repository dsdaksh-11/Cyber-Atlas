import prisma from '@/lib/prisma'
import { RawIngestionRecord } from '@/types/cyberlaw'

/**
 * Data Ingestion Pipeline & Architecture
 * 
 * Provides structured, audited legal data ingestion for global cybercrime and cybersecurity laws.
 * Aligned with UNCTAD Cyberlaw Tracker taxonomy and national legal gazettes.
 */

export interface IngestionResult {
  success: boolean
  processedCount: number
  errors: string[]
  insertedCountryId?: string
}

export async function ingestLegalRecord(record: RawIngestionRecord): Promise<IngestionResult> {
  const errors: string[] = []

  // 1. Validation & Source Attribution Enforcement
  if (!record.officialGazetteUrl && !record.attributionSourceUrl) {
    errors.push(`Record '${record.lawTitle}' rejected: Source URL or Official Gazette link is required for attribution.`)
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

    // 3. Formulate provisions list
    const provisionsText = Array.isArray(record.keyProvisionsList)
      ? record.keyProvisionsList.join(' | ')
      : record.keyProvisionsList

    // 4. Create CyberLaw record with source attribution
    await prisma.cyberLaw.create({
      data: {
        title: record.lawTitle,
        year: record.enactmentYear,
        category: record.primaryCategory,
        summary: record.executiveSummary,
        keyProvisions: provisionsText,
        authority: record.enforcingAuthority,
        officialUrl: record.officialGazetteUrl || record.attributionSourceUrl,
        sourceName: record.attributionSourceName || 'Official Legal Source',
        sourceUrl: record.attributionSourceUrl || record.officialGazetteUrl,
        lastUpdated: record.lastVerificationDate || new Date().toISOString().split('T')[0],
        isSampleData: false, // Flagged as verified ingested data
        countryId: country.id,
      },
    })

    return {
      success: true,
      processedCount: 1,
      errors: [],
      insertedCountryId: country.id,
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
