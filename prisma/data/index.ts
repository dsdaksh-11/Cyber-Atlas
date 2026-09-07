// ============================================================================
// CYBERLAW ATLAS — MODULAR VERIFIED STATUTORY INSTRUMENTS REGISTRY
// Consolidates 42 jurisdictions (378 verified statutory instruments)
// Combined with Batches 1 & 2 (IN, US, GB, AU, CA, SG - 61 instruments),
// this achieves 100% statutory coverage across all 48 jurisdictions and 9 categories.
// ============================================================================

export { type VerifiedSeedInstrument } from './verified-europe-core'
export { europeCoreInstruments } from './verified-europe-core'
export { europeNorthEastInstruments } from './verified-europe-north-east'
export { apacMideastInstruments } from './verified-apac-mideast'
export { americasInstruments } from './verified-americas'
export { africaOceaniaInstruments } from './verified-africa-oceania'

import { europeCoreInstruments, VerifiedSeedInstrument } from './verified-europe-core'
import { europeNorthEastInstruments } from './verified-europe-north-east'
import { apacMideastInstruments } from './verified-apac-mideast'
import { americasInstruments } from './verified-americas'
import { africaOceaniaInstruments } from './verified-africa-oceania'

export const allRemaining42VerifiedInstruments: VerifiedSeedInstrument[] = [
  ...europeCoreInstruments,
  ...europeNorthEastInstruments,
  ...apacMideastInstruments,
  ...americasInstruments,
  ...africaOceaniaInstruments,
]
