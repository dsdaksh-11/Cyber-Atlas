import prisma from '../lib/prisma'

async function testEndpoints() {
  console.log('Testing data layer and queries directly...\n')

  // 1. Test Countries listing
  const countries = await prisma.country.findMany({
    include: {
      _count: {
        select: {
          laws: true,
          instruments: true,
          coverages: true,
        },
      },
    },
    take: 3,
  })

  console.log('Sample Countries:', countries.map(c => ({
    name: c.name,
    isoCode: c.isoCode,
    instrumentsCount: c._count.instruments,
    coveragesCount: c._count.coverages,
  })))

  // 2. Test India (IN) profile data
  const india = await prisma.country.findFirst({
    where: { isoCode: 'IN' },
    include: {
      coverages: {
        include: { category: true },
        orderBy: { category: { displayOrder: 'asc' } },
      },
      instruments: {
        include: {
          category: true,
          provisions: true,
          sources: true,
        },
      },
    },
  })

  if (!india) throw new Error('India not found in database')

  console.log(`\nIndia (${india.isoCode}) profile:`)
  console.log(`  • Instruments documented: ${india.instruments.length}`)
  console.log(`  • Coverages evaluated:    ${india.coverages.length}`)
  console.log('  • First 3 instruments:')
  india.instruments.forEach(inst => {
    console.log(`    - [${inst.instrumentType}] ${inst.title} (${inst.category.name}): ${inst.provisions.length} provisions, ${inst.sources.length} sources`)
  })
  console.log('  • UNCTAD Baseline Coverages:')
  india.coverages.filter(c => c.category.unctadBaseline).forEach(cov => {
    console.log(`    - ${cov.category.name}: status=${cov.coverageStatus}, unctadStatus="${cov.unctadBaselineStatus}", verified=${cov.verifiedCount}`)
  })

  // 3. Test US profile data
  const us = await prisma.country.findFirst({
    where: { isoCode: 'US' },
    include: {
      coverages: {
        include: { category: true },
      },
      instruments: {
        include: { category: true },
      },
    },
  })

  if (!us) throw new Error('US not found in database')
  console.log(`\nUnited States (${us.isoCode}) profile:`)
  console.log(`  • Instruments documented: ${us.instruments.length}`)
  console.log(`  • Coverages evaluated:    ${us.coverages.length}`)

  // 4. Test Category Counts
  const totalCategories = await prisma.legalCategory.count()
  const totalCoverages = await prisma.countryCoverage.count()
  console.log(`\nTotals:`)
  console.log(`  • Total Categories: ${totalCategories}`)
  console.log(`  • Total Country Coverages: ${totalCoverages} (expected 48 * 9 = 432)`)

  if (totalCoverages !== 432) {
    throw new Error(`Expected 432 coverage records, found ${totalCoverages}`)
  }

  console.log('\n✅ ALL DIRECT DATA LAYER TESTS PASSED!')
}

testEndpoints()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
