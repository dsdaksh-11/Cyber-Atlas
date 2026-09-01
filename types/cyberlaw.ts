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
  | 'Other'

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
  _count?: {
    laws: number
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
  enactmentYear: number
  primaryCategory: LegalCategory
  executiveSummary: string
  keyProvisionsList: string[]
  enforcingAuthority: string
  officialGazetteUrl: string
  attributionSourceName: string
  attributionSourceUrl: string
  lastVerificationDate: string
}
