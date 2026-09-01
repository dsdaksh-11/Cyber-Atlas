/**
 * ISO 3166-1 alpha-2 and Country Name lookup map for robust normalization.
 * Supports 48 global jurisdictions across 6 continents.
 */

export interface CountryMeta {
  isoCode: string
  name: string
  flagEmoji: string
  region: string
}

export interface CountryAliasMap {
  [key: string]: CountryMeta
}

export const KNOWN_COUNTRIES: CountryAliasMap = {
  // --- ASIA (15) ---
  IN: { isoCode: 'IN', name: 'India', flagEmoji: '🇮🇳', region: 'Asia-Pacific' },
  INDIA: { isoCode: 'IN', name: 'India', flagEmoji: '🇮🇳', region: 'Asia-Pacific' },

  CN: { isoCode: 'CN', name: 'China', flagEmoji: '🇨🇳', region: 'Asia-Pacific' },
  CHINA: { isoCode: 'CN', name: 'China', flagEmoji: '🇨🇳', region: 'Asia-Pacific' },
  PRC: { isoCode: 'CN', name: 'China', flagEmoji: '🇨🇳', region: 'Asia-Pacific' },

  JP: { isoCode: 'JP', name: 'Japan', flagEmoji: '🇯🇵', region: 'Asia-Pacific' },
  JAPAN: { isoCode: 'JP', name: 'Japan', flagEmoji: '🇯🇵', region: 'Asia-Pacific' },

  KR: { isoCode: 'KR', name: 'South Korea', flagEmoji: '🇰🇷', region: 'Asia-Pacific' },
  KOREA: { isoCode: 'KR', name: 'South Korea', flagEmoji: '🇰🇷', region: 'Asia-Pacific' },
  'SOUTH KOREA': { isoCode: 'KR', name: 'South Korea', flagEmoji: '🇰🇷', region: 'Asia-Pacific' },
  'REPUBLIC OF KOREA': { isoCode: 'KR', name: 'South Korea', flagEmoji: '🇰🇷', region: 'Asia-Pacific' },

  SG: { isoCode: 'SG', name: 'Singapore', flagEmoji: '🇸🇬', region: 'Asia-Pacific' },
  SINGAPORE: { isoCode: 'SG', name: 'Singapore', flagEmoji: '🇸🇬', region: 'Asia-Pacific' },

  MY: { isoCode: 'MY', name: 'Malaysia', flagEmoji: '🇲🇾', region: 'Asia-Pacific' },
  MALAYSIA: { isoCode: 'MY', name: 'Malaysia', flagEmoji: '🇲🇾', region: 'Asia-Pacific' },

  TH: { isoCode: 'TH', name: 'Thailand', flagEmoji: '🇹🇭', region: 'Asia-Pacific' },
  THAILAND: { isoCode: 'TH', name: 'Thailand', flagEmoji: '🇹🇭', region: 'Asia-Pacific' },

  ID: { isoCode: 'ID', name: 'Indonesia', flagEmoji: '🇮🇩', region: 'Asia-Pacific' },
  INDONESIA: { isoCode: 'ID', name: 'Indonesia', flagEmoji: '🇮🇩', region: 'Asia-Pacific' },

  PH: { isoCode: 'PH', name: 'Philippines', flagEmoji: '🇵🇭', region: 'Asia-Pacific' },
  PHILIPPINES: { isoCode: 'PH', name: 'Philippines', flagEmoji: '🇵🇭', region: 'Asia-Pacific' },
  'THE PHILIPPINES': { isoCode: 'PH', name: 'Philippines', flagEmoji: '🇵🇭', region: 'Asia-Pacific' },

  VN: { isoCode: 'VN', name: 'Vietnam', flagEmoji: '🇻🇳', region: 'Asia-Pacific' },
  VIETNAM: { isoCode: 'VN', name: 'Vietnam', flagEmoji: '🇻🇳', region: 'Asia-Pacific' },
  VIET_NAM: { isoCode: 'VN', name: 'Vietnam', flagEmoji: '🇻🇳', region: 'Asia-Pacific' },

  AE: { isoCode: 'AE', name: 'United Arab Emirates', flagEmoji: '🇦🇪', region: 'Middle East' },
  UAE: { isoCode: 'AE', name: 'United Arab Emirates', flagEmoji: '🇦🇪', region: 'Middle East' },
  'UNITED ARAB EMIRATES': { isoCode: 'AE', name: 'United Arab Emirates', flagEmoji: '🇦🇪', region: 'Middle East' },

  SA: { isoCode: 'SA', name: 'Saudi Arabia', flagEmoji: '🇸🇦', region: 'Middle East' },
  'SAUDI ARABIA': { isoCode: 'SA', name: 'Saudi Arabia', flagEmoji: '🇸🇦', region: 'Middle East' },
  KSA: { isoCode: 'SA', name: 'Saudi Arabia', flagEmoji: '🇸🇦', region: 'Middle East' },

  QA: { isoCode: 'QA', name: 'Qatar', flagEmoji: '🇶🇦', region: 'Middle East' },
  QATAR: { isoCode: 'QA', name: 'Qatar', flagEmoji: '🇶🇦', region: 'Middle East' },

  IL: { isoCode: 'IL', name: 'Israel', flagEmoji: '🇮🇱', region: 'Middle East' },
  ISRAEL: { isoCode: 'IL', name: 'Israel', flagEmoji: '🇮🇱', region: 'Middle East' },

  TR: { isoCode: 'TR', name: 'Türkiye', flagEmoji: '🇹🇷', region: 'Middle East' },
  TURKEY: { isoCode: 'TR', name: 'Türkiye', flagEmoji: '🇹🇷', region: 'Middle East' },
  TÜRKIYE: { isoCode: 'TR', name: 'Türkiye', flagEmoji: '🇹🇷', region: 'Middle East' },
  TURKIYE: { isoCode: 'TR', name: 'Türkiye', flagEmoji: '🇹🇷', region: 'Middle East' },

  // --- EUROPE (17) ---
  GB: { isoCode: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧', region: 'Europe' },
  UK: { isoCode: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧', region: 'Europe' },
  'UNITED KINGDOM': { isoCode: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧', region: 'Europe' },
  BRITAIN: { isoCode: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧', region: 'Europe' },

  DE: { isoCode: 'DE', name: 'Germany', flagEmoji: '🇩🇪', region: 'Europe' },
  GERMANY: { isoCode: 'DE', name: 'Germany', flagEmoji: '🇩🇪', region: 'Europe' },
  DEUTSCHLAND: { isoCode: 'DE', name: 'Germany', flagEmoji: '🇩🇪', region: 'Europe' },

  FR: { isoCode: 'FR', name: 'France', flagEmoji: '🇫🇷', region: 'Europe' },
  FRANCE: { isoCode: 'FR', name: 'France', flagEmoji: '🇫🇷', region: 'Europe' },

  IT: { isoCode: 'IT', name: 'Italy', flagEmoji: '🇮🇹', region: 'Europe' },
  ITALY: { isoCode: 'IT', name: 'Italy', flagEmoji: '🇮🇹', region: 'Europe' },

  ES: { isoCode: 'ES', name: 'Spain', flagEmoji: '🇪🇸', region: 'Europe' },
  SPAIN: { isoCode: 'ES', name: 'Spain', flagEmoji: '🇪🇸', region: 'Europe' },
  ESPAÑA: { isoCode: 'ES', name: 'Spain', flagEmoji: '🇪🇸', region: 'Europe' },

  NL: { isoCode: 'NL', name: 'Netherlands', flagEmoji: '🇳🇱', region: 'Europe' },
  NETHERLANDS: { isoCode: 'NL', name: 'Netherlands', flagEmoji: '🇳🇱', region: 'Europe' },
  HOLLAND: { isoCode: 'NL', name: 'Netherlands', flagEmoji: '🇳🇱', region: 'Europe' },

  BE: { isoCode: 'BE', name: 'Belgium', flagEmoji: '🇧🇪', region: 'Europe' },
  BELGIUM: { isoCode: 'BE', name: 'Belgium', flagEmoji: '🇧🇪', region: 'Europe' },

  CH: { isoCode: 'CH', name: 'Switzerland', flagEmoji: '🇨🇭', region: 'Europe' },
  SWITZERLAND: { isoCode: 'CH', name: 'Switzerland', flagEmoji: '🇨🇭', region: 'Europe' },

  SE: { isoCode: 'SE', name: 'Sweden', flagEmoji: '🇸🇪', region: 'Europe' },
  SWEDEN: { isoCode: 'SE', name: 'Sweden', flagEmoji: '🇸🇪', region: 'Europe' },

  NO: { isoCode: 'NO', name: 'Norway', flagEmoji: '🇳🇴', region: 'Europe' },
  NORWAY: { isoCode: 'NO', name: 'Norway', flagEmoji: '🇳🇴', region: 'Europe' },

  DK: { isoCode: 'DK', name: 'Denmark', flagEmoji: '🇩🇰', region: 'Europe' },
  DENMARK: { isoCode: 'DK', name: 'Denmark', flagEmoji: '🇩🇰', region: 'Europe' },

  FI: { isoCode: 'FI', name: 'Finland', flagEmoji: '🇫🇮', region: 'Europe' },
  FINLAND: { isoCode: 'FI', name: 'Finland', flagEmoji: '🇫🇮', region: 'Europe' },

  PL: { isoCode: 'PL', name: 'Poland', flagEmoji: '🇵🇱', region: 'Europe' },
  POLAND: { isoCode: 'PL', name: 'Poland', flagEmoji: '🇵🇱', region: 'Europe' },

  PT: { isoCode: 'PT', name: 'Portugal', flagEmoji: '🇵🇹', region: 'Europe' },
  PORTUGAL: { isoCode: 'PT', name: 'Portugal', flagEmoji: '🇵🇹', region: 'Europe' },

  IE: { isoCode: 'IE', name: 'Ireland', flagEmoji: '🇮🇪', region: 'Europe' },
  IRELAND: { isoCode: 'IE', name: 'Ireland', flagEmoji: '🇮🇪', region: 'Europe' },
  EIRE: { isoCode: 'IE', name: 'Ireland', flagEmoji: '🇮🇪', region: 'Europe' },

  AT: { isoCode: 'AT', name: 'Austria', flagEmoji: '🇦🇹', region: 'Europe' },
  AUSTRIA: { isoCode: 'AT', name: 'Austria', flagEmoji: '🇦🇹', region: 'Europe' },

  GR: { isoCode: 'GR', name: 'Greece', flagEmoji: '🇬🇷', region: 'Europe' },
  GREECE: { isoCode: 'GR', name: 'Greece', flagEmoji: '🇬🇷', region: 'Europe' },

  // --- NORTH AMERICA (3) ---
  US: { isoCode: 'US', name: 'United States', flagEmoji: '🇺🇸', region: 'Americas' },
  USA: { isoCode: 'US', name: 'United States', flagEmoji: '🇺🇸', region: 'Americas' },
  'UNITED STATES': { isoCode: 'US', name: 'United States', flagEmoji: '🇺🇸', region: 'Americas' },
  AMERICA: { isoCode: 'US', name: 'United States', flagEmoji: '🇺🇸', region: 'Americas' },

  CA: { isoCode: 'CA', name: 'Canada', flagEmoji: '🇨🇦', region: 'Americas' },
  CANADA: { isoCode: 'CA', name: 'Canada', flagEmoji: '🇨🇦', region: 'Americas' },

  MX: { isoCode: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', region: 'Americas' },
  MEXICO: { isoCode: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', region: 'Americas' },

  // --- SOUTH AMERICA (5) ---
  BR: { isoCode: 'BR', name: 'Brazil', flagEmoji: '🇧🇷', region: 'Americas' },
  BRAZIL: { isoCode: 'BR', name: 'Brazil', flagEmoji: '🇧🇷', region: 'Americas' },
  BRASIL: { isoCode: 'BR', name: 'Brazil', flagEmoji: '🇧🇷', region: 'Americas' },

  AR: { isoCode: 'AR', name: 'Argentina', flagEmoji: '🇦🇷', region: 'Americas' },
  ARGENTINA: { isoCode: 'AR', name: 'Argentina', flagEmoji: '🇦🇷', region: 'Americas' },

  CL: { isoCode: 'CL', name: 'Chile', flagEmoji: '🇨🇱', region: 'Americas' },
  CHILE: { isoCode: 'CL', name: 'Chile', flagEmoji: '🇨🇱', region: 'Americas' },

  CO: { isoCode: 'CO', name: 'Colombia', flagEmoji: '🇨🇴', region: 'Americas' },
  COLOMBIA: { isoCode: 'CO', name: 'Colombia', flagEmoji: '🇨🇴', region: 'Americas' },

  PE: { isoCode: 'PE', name: 'Peru', flagEmoji: '🇵🇪', region: 'Americas' },
  PERU: { isoCode: 'PE', name: 'Peru', flagEmoji: '🇵🇪', region: 'Americas' },

  // --- AFRICA (6) ---
  ZA: { isoCode: 'ZA', name: 'South Africa', flagEmoji: '🇿🇦', region: 'Africa' },
  'SOUTH AFRICA': { isoCode: 'ZA', name: 'South Africa', flagEmoji: '🇿🇦', region: 'Africa' },

  NG: { isoCode: 'NG', name: 'Nigeria', flagEmoji: '🇳🇬', region: 'Africa' },
  NIGERIA: { isoCode: 'NG', name: 'Nigeria', flagEmoji: '🇳🇬', region: 'Africa' },

  KE: { isoCode: 'KE', name: 'Kenya', flagEmoji: '🇰🇪', region: 'Africa' },
  KENYA: { isoCode: 'KE', name: 'Kenya', flagEmoji: '🇰🇪', region: 'Africa' },

  EG: { isoCode: 'EG', name: 'Egypt', flagEmoji: '🇪🇬', region: 'Africa' },
  EGYPT: { isoCode: 'EG', name: 'Egypt', flagEmoji: '🇪🇬', region: 'Africa' },

  GH: { isoCode: 'GH', name: 'Ghana', flagEmoji: '🇬🇭', region: 'Africa' },
  GHANA: { isoCode: 'GH', name: 'Ghana', flagEmoji: '🇬🇭', region: 'Africa' },

  MA: { isoCode: 'MA', name: 'Morocco', flagEmoji: '🇲🇦', region: 'Africa' },
  MOROCCO: { isoCode: 'MA', name: 'Morocco', flagEmoji: '🇲🇦', region: 'Africa' },

  // --- OCEANIA (2) ---
  AU: { isoCode: 'AU', name: 'Australia', flagEmoji: '🇦🇺', region: 'Oceania' },
  AUSTRALIA: { isoCode: 'AU', name: 'Australia', flagEmoji: '🇦🇺', region: 'Oceania' },

  NZ: { isoCode: 'NZ', name: 'New Zealand', flagEmoji: '🇳🇿', region: 'Oceania' },
  'NEW ZEALAND': { isoCode: 'NZ', name: 'New Zealand', flagEmoji: '🇳🇿', region: 'Oceania' },
}

/**
 * Normalizes input string (code or country name) to uppercase standard ISO 3166-1 alpha-2 code
 */
export function normalizeCountryCode(input: string): string {
  if (!input) return ''

  const cleaned = input.trim().toUpperCase()

  // Exact alias match
  if (KNOWN_COUNTRIES[cleaned]) {
    return KNOWN_COUNTRIES[cleaned].isoCode
  }

  // 2-letter uppercase ISO code check
  if (/^[A-Z]{2}$/.test(cleaned)) {
    return cleaned
  }

  return cleaned
}

/**
 * Validates whether string is a 2-letter ISO code
 */
export function isIsoCode(input: string): boolean {
  return /^[A-Za-z]{2}$/.test(input.trim())
}
