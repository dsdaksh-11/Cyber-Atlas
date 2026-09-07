import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ValidationIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO'
  category: string
  entityId?: string
  entityName?: string
  message: string
}

async function validateDatabase() {
  console.log('====================================================================')
  console.log('      CYBERLAW ATLAS — LEGAL DATA QUALITY VALIDATION SUITE          ')
  console.log('====================================================================\n')

  const issues: ValidationIssue[] = []

  try {
    const countries = await prisma.country.findMany({
      include: {
        instruments: {
          include: {
            category: true,
            provisions: true,
            sources: true,
          },
        },
        coverages: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const categories = await prisma.legalCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    const totalCountries = countries.length
    const totalInstruments = await prisma.legalInstrument.count()
    const totalProvisions = await prisma.legalProvision.count()
    const totalSources = await prisma.legalSource.count()
    const totalCoverages = await prisma.countryCoverage.count()

    console.log(`Audited Records:`)
    console.log(`  • Jurisdictions:        ${totalCountries}`)
    console.log(`  • Legal Categories:     ${categories.length}`)
    console.log(`  • Legal Instruments:    ${totalInstruments}`)
    console.log(`  • Structured Provisions: ${totalProvisions}`)
    console.log(`  • Official Sources:     ${totalSources}`)
    console.log(`  • Coverage Records:     ${totalCoverages}\n`)

    // 1. Country & Coverage Integrity Checks
    for (const country of countries) {
      if (country.coverages.length === 0) {
        issues.push({
          severity: 'ERROR',
          category: 'Missing Coverage',
          entityId: country.id,
          entityName: country.name,
          message: `Country ${country.name} (${country.isoCode}) has 0 CountryCoverage tracking records.`,
        })
      } else if (country.coverages.length < categories.length) {
        issues.push({
          severity: 'WARNING',
          category: 'Partial Coverage Model',
          entityId: country.id,
          entityName: country.name,
          message: `Country ${country.name} only has ${country.coverages.length}/${categories.length} category coverage records.`,
        })
      }

      // Check coverage records without status
      for (const cov of country.coverages) {
        if (!cov.coverageStatus || cov.coverageStatus.trim() === '') {
          issues.push({
            severity: 'ERROR',
            category: 'Missing Status',
            entityId: cov.id,
            entityName: `${country.isoCode} - ${cov.category?.name}`,
            message: `Coverage record has blank coverageStatus.`,
          })
        }
      }
    }

    // 2. Legal Instrument Checks
    const allInstruments = await prisma.legalInstrument.findMany({
      include: {
        country: true,
        category: true,
        provisions: true,
        sources: true,
      },
    })

    const seenTitlesByCountry = new Map<string, string>()
    const seenOfficialUrls = new Map<string, string[]>()

    for (const inst of allInstruments) {
      // Duplicate title within country
      const countryTitleKey = `${inst.country.isoCode}::${inst.title.toLowerCase().trim()}`
      if (seenTitlesByCountry.has(countryTitleKey)) {
        issues.push({
          severity: 'ERROR',
          category: 'Duplicate Instrument',
          entityId: inst.id,
          entityName: inst.title,
          message: `Duplicate title in ${inst.country.name}: "${inst.title}" matches instrument ${seenTitlesByCountry.get(countryTitleKey)}`,
        })
      } else {
        seenTitlesByCountry.set(countryTitleKey, inst.id)
      }

      // Missing Country Relationship
      if (!inst.countryId || !inst.country) {
        issues.push({
          severity: 'ERROR',
          category: 'Orphaned Instrument',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument has no associated country.`,
        })
      }

      // Missing Category Relationship
      if (!inst.categoryId || !inst.category) {
        issues.push({
          severity: 'ERROR',
          category: 'Missing Category',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument has no associated legal category.`,
        })
      }

      // Missing or Invalid Official URLs
      if (!inst.officialUrl || inst.officialUrl.trim() === '' || inst.officialUrl === '#') {
        issues.push({
          severity: 'ERROR',
          category: 'Missing Official URL',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument "${inst.title}" (${inst.country.isoCode}) has no official source URL.`,
        })
      } else {
        const urlKey = inst.officialUrl.trim()
        const existing = seenOfficialUrls.get(urlKey) || []
        existing.push(`${inst.country.isoCode}: ${inst.title}`)
        seenOfficialUrls.set(urlKey, existing)
      }

      // Invalid Dates
      if (!inst.yearEnacted || inst.yearEnacted < 1900 || inst.yearEnacted > new Date().getFullYear() + 2) {
        issues.push({
          severity: 'ERROR',
          category: 'Invalid Date',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument has invalid enactment year: ${inst.yearEnacted}.`,
        })
      }

      // Missing Authority
      if (!inst.issuingAuthority || inst.issuingAuthority.trim() === '') {
        issues.push({
          severity: 'WARNING',
          category: 'Missing Authority',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument "${inst.title}" has no designated issuing/enforcing authority.`,
        })
      }

      // Vague or Empty Summary
      if (!inst.summary || inst.summary.trim().length < 25) {
        issues.push({
          severity: 'WARNING',
          category: 'Insufficient Summary',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument summary is empty or too short (< 25 chars).`,
        })
      }

      // Missing Provisions
      if (inst.provisions.length === 0) {
        issues.push({
          severity: 'WARNING',
          category: 'No Provisions',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument "${inst.title}" has 0 structured legal provisions parsed.`,
        })
      }

      // Sample Data presented as Verified Data
      if (inst.isSampleData && inst.verificationStatus === 'VERIFIED') {
        issues.push({
          severity: 'ERROR',
          category: 'Misleading Verification',
          entityId: inst.id,
          entityName: inst.title,
          message: `Instrument "${inst.title}" is flagged as sample data but has verificationStatus 'VERIFIED'.`,
        })
      }
    }

    // Shared Official URLs Check (Warning)
    for (const [url, instrumentsList] of seenOfficialUrls.entries()) {
      if (instrumentsList.length > 1) {
        issues.push({
          severity: 'WARNING',
          category: 'Shared Portal URL',
          message: `Multiple instruments share identical URL (${url}): ${instrumentsList.join(' AND ')}`,
        })
      }
    }

    // 3. Category Coverage & Baseline Gaps (Informational)
    for (const country of countries) {
      const unresearched = country.coverages.filter((c) => c.coverageStatus === 'NOT_RESEARCHED')
      if (unresearched.length > 0) {
        issues.push({
          severity: 'INFO',
          category: 'Unresearched Category',
          entityName: `${country.name} (${country.isoCode})`,
          message: `${unresearched.length} categories currently pending research: ${unresearched.map((u) => u.category?.name).join(', ')}`,
        })
      }
    }

    // Output Grouped Report
    const errors = issues.filter((i) => i.severity === 'ERROR')
    const warnings = issues.filter((i) => i.severity === 'WARNING')
    const infos = issues.filter((i) => i.severity === 'INFO')

    console.log('--------------------------------------------------------------------')
    console.log(`🔴 ERRORS (${errors.length}):`)
    console.log('--------------------------------------------------------------------')
    if (errors.length === 0) {
      console.log('  None. All structural and integrity requirements passed.')
    } else {
      errors.forEach((e) => console.log(`  [${e.category}] ${e.entityName ? `${e.entityName}: ` : ''}${e.message}`))
    }

    console.log('\n--------------------------------------------------------------------')
    console.log(`🟡 WARNINGS (${warnings.length}):`)
    console.log('--------------------------------------------------------------------')
    if (warnings.length === 0) {
      console.log('  None.')
    } else {
      warnings.forEach((w) => console.log(`  [${w.category}] ${w.entityName ? `${w.entityName}: ` : ''}${w.message}`))
    }

    console.log('\n--------------------------------------------------------------------')
    console.log(`ℹ️  INFORMATIONAL FINDINGS (${infos.length}):`)
    console.log('--------------------------------------------------------------------')
    console.log(`  ${infos.length} country-category combinations are marked NOT_RESEARCHED / PENDING in accordance with methodology.`)
    console.log(`  (Transparently tracks research backlog without false completeness claims.)\n`)

    console.log('====================================================================')
    if (errors.length === 0) {
      console.log('✅ VALIDATION PASSED: Database methodology and schema rules satisfied.')
    } else {
      console.log('❌ VALIDATION FAILED: Correct the above errors before proceeding.')
      process.exit(1)
    }
    console.log('====================================================================\n')
  } catch (err) {
    console.error('Validation error occurred:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

validateDatabase()
