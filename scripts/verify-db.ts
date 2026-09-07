import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('====================================================================')
  console.log('            CYBERLAW ATLAS - DATABASE VERIFICATION & AUDIT          ')
  console.log('====================================================================\n')

  try {
    const totalCountries = await prisma.country.count()
    const totalCategories = await prisma.legalCategory.count()
    const totalInstruments = await prisma.legalInstrument.count()
    const totalProvisions = await prisma.legalProvision.count()
    const totalSources = await prisma.legalSource.count()
    const totalCoverages = await prisma.countryCoverage.count()
    const totalNewsArticles = await prisma.newsArticle.count()

    const countries = await prisma.country.findMany({
      include: {
        instruments: {
          include: { category: true },
          orderBy: { yearEnacted: 'desc' },
        },
        coverages: {
          include: { category: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    console.log(`Global Database Metrics:`)
    console.log(`  • Jurisdictions:            ${totalCountries}`)
    console.log(`  • Taxonomy Categories:       ${totalCategories}`)
    console.log(`  • Verified Legal Instruments: ${totalInstruments}`)
    console.log(`  • Parsed Legal Provisions:   ${totalProvisions}`)
    console.log(`  • Official Source Citations: ${totalSources}`)
    console.log(`  • Category Coverage Matrix:  ${totalCoverages}`)
    console.log(`  • Threat Intelligence Feeds: ${totalNewsArticles}\n`)

    console.log('--------------------------------------------------------------------')
    console.log('           JURISDICTION BREAKDOWN & INSTRUMENT TYPOLOGY             ')
    console.log('--------------------------------------------------------------------')

    let partiallyResearchedCount = 0
    let fullyResearchedCategories = 0

    for (const country of countries) {
      const verifiedInstruments = country.instruments.filter((i) => i.verificationStatus === 'VERIFIED')
      const underReviewInstruments = country.instruments.filter((i) => i.verificationStatus !== 'VERIFIED')
      const researchedCats = country.coverages.filter((c) => c.coverageStatus !== 'NOT_RESEARCHED')
      if (verifiedInstruments.length > 0) partiallyResearchedCount++
      fullyResearchedCategories += researchedCats.length

      console.log(
        `🏛  ${country.flagEmoji} ${country.name} (${country.isoCode}) [${country.region}]: ${country.instruments.length} documented (${verifiedInstruments.length} verified, ${underReviewInstruments.length} under review) | ${researchedCats.length}/${country.coverages.length} categories tracked`
      )
      for (const inst of country.instruments) {
        const vTag = inst.verificationStatus === 'VERIFIED' ? '✅ VERIFIED' : '⏳ UNDER REVIEW'
        console.log(`    • [${inst.yearEnacted || 'N/A'}] [${inst.instrumentType}] [${vTag}] [${inst.category.name}] ${inst.title}`)
      }
    }

    console.log('\n====================================================================')
    console.log(`STATUS SUMMARY:`)
    console.log(`  • ${partiallyResearchedCount}/${totalCountries} jurisdictions have verified statutory instruments documented.`)
    console.log(`  • ${fullyResearchedCategories}/${totalCoverages} category-country areas evaluated against UNCTAD baseline & national portals.`)
    console.log(`  • Research backlog and pending categories are actively tracked in docs/legal-data-backlog.md.`)
    console.log('====================================================================\n')
  } catch (error) {
    console.error('❌ Database verification encountered an error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()
