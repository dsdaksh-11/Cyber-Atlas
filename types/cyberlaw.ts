export type LegalCategory =
  | 'Cybercrime'
  | 'Data Protection'
  | 'Privacy'
  | 'Cybersecurity'
  | 'Electronic Transactions'
  | 'Digital Evidence'
  | 'Online Fraud'
  | 'Intellectual Property'
  | 'Critical Infrastructure'
  | 'Consumer Protection'
  | 'Indirect Taxation'
  | 'Other'

export type InstrumentType =
  | 'ACT'
  | 'LAW'
  | 'CODE_PROVISION'
  | 'REGULATION'
  | 'RULE'
  | 'DIRECTIVE'
  | 'DECREE'
  | 'AMENDMENT'
  | 'NOTIFICATION'
  | 'SECTOR_REGULATION'
  | 'TREATY'
  | 'FRAMEWORK'
  | 'STRATEGY'

export type CoverageStatus =
  | 'NOT_RESEARCHED'
  | 'RESEARCH_PENDING'
  | 'PARTIALLY_RESEARCHED'
  | 'RESEARCH_COMPLETED'
  | 'VERIFIED'
  | 'NOT_APPLICABLE'
  | 'NEEDS_REVIEW'

export type VerificationStatus =
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'SAMPLE'
  | 'NEEDS_REVIEW'
  | 'IN_PROGRESS'

export interface LegalProvisionData {
  id: string
  instrumentId: string
  articleNumber?: string | null
  heading?: string | null
  content: string
  penaltyDetails?: string | null
  reportingMandate?: string | null
  displayOrder: number
}

export interface LegalSourceData {
  id: string
  instrumentId: string
  name: string
  url: string
  sourceType: string
  isOfficial: boolean
  retrievedDate?: string | null
}

export interface LegalCategoryData {
  id: string
  key: string
  name: string
  description: string
  unctadBaseline: boolean
  unctadArea?: string | null
  displayOrder: number
}

export interface CountryCoverageData {
  id: string
  countryId: string
  categoryId: string
  category?: LegalCategoryData
  coverageStatus: CoverageStatus | string
  unctadBaselineCovered?: boolean | null
  unctadBaselineStatus?: string | null
  unctadLastChecked?: string | null
  verifiedCount: number
  unverifiedCount: number
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | string
  lastResearchedDate?: string | null
  lastVerifiedDate?: string | null
  researchNotes?: string | null
  assessmentSource?: string | null
}

export interface LegalInstrumentData {
  id: string
  title: string
  officialTitle?: string | null
  shortTitle?: string | null
  instrumentType: InstrumentType | string
  countryId: string
  categoryId: string
  category?: LegalCategoryData
  jurisdictionLevel: string
  yearEnacted?: number | null
  effectiveDate?: string | null
  currentStatus: string
  amendmentStatus: string
  isPrimaryLegislation: boolean
  summary: string
  keyProvisionsText?: string | null
  issuingAuthority: string
  verificationStatus: VerificationStatus | string
  isSampleData: boolean
  lastVerifiedDate?: string | null
  researchNotes?: string | null
  officialUrl?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
  parentInstrumentId?: string | null
  parentInstrument?: LegalInstrumentData | null
  childInstruments?: LegalInstrumentData[]
  provisions?: LegalProvisionData[]
  sources?: LegalSourceData[]
}

// Legacy CyberLaw interface (kept for backwards compatibility)
export interface CyberLawData {
  id: string
  title: string
  year: number
  category: string
  summary: string
  keyProvisions: string
  authority: string
  officialUrl: string
  sourceName: string
  sourceUrl: string
  lastUpdated: string
  isSampleData: boolean
  countryId: string
}

export interface CountryData {
  id: string
  name: string
  isoCode: string
  region: string
  flagEmoji: string
  laws?: CyberLawData[]
  instruments?: LegalInstrumentData[]
  coverages?: CountryCoverageData[]
  _count?: {
    laws?: number
    instruments?: number
    coverages?: number
  }
}

export interface SearchSuggestion {
  name: string
  isoCode: string
  flagEmoji: string
  region: string
  lawCount: number
}

// Ingestion Schema matching UNCTAD Cyberlaw Tracker & Official Source standard
export interface RawIngestionRecord {
  countryName: string
  isoCode: string
  region: string
  flagEmoji: string
  lawTitle: string
  officialTitle?: string
  shortTitle?: string
  instrumentType?: InstrumentType
  enactmentYear: number
  primaryCategory: LegalCategory
  executiveSummary: string
  keyProvisionsList: string[]
  enforcingAuthority: string
  officialGazetteUrl: string
  attributionSourceName: string
  attributionSourceUrl: string
  lastVerificationDate: string
  isPrimaryLegislation?: boolean
  parentLawTitle?: string
}
