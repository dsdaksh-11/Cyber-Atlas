import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function runAudit() {
  const totalCountries = await prisma.country.count()
  const totalLaws = await prisma.cyberLaw.count()
  const countries = await prisma.country.findMany({
    include: { laws: true },
    orderBy: { name: 'asc' },
  })

  const categoryCounts: Record<string, number> = {}
  const countryCounts: Record<string, number> = {}
  let missingOfficialUrls = 0
  let missingSourceUrls = 0
  let sampleDataCount = 0
  let missingDates = 0
  let missingAuthority = 0
  let shortOrVagueSummary = 0

  const allLaws = countries.flatMap((c) => c.laws.map((l) => ({ ...l, countryCode: c.isoCode, countryName: c.name })))

  const seenTitles = new Map<string, string[]>()
  const seenUrls = new Map<string, string[]>()

  for (const l of allLaws) {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1
    countryCounts[l.countryCode] = (countryCounts[l.countryCode] || 0) + 1

    if (!l.officialUrl || l.officialUrl.trim() === '' || l.officialUrl === '#') missingOfficialUrls++
    if (!l.sourceUrl || l.sourceUrl.trim() === '' || l.sourceUrl === '#') missingSourceUrls++
    if (l.isSampleData) sampleDataCount++
    if (!l.year || l.year <= 1900 || l.year > 2026) missingDates++
    if (!l.authority || l.authority.trim() === '') missingAuthority++
    if (!l.summary || l.summary.trim().length < 30) shortOrVagueSummary++

    const titleKey = `${l.title.toLowerCase().trim()}`
    const existingTitles = seenTitles.get(titleKey) || []
    existingTitles.push(`${l.countryCode}: ${l.title}`)
    seenTitles.set(titleKey, existingTitles)

    if (l.officialUrl && l.officialUrl !== '#') {
      const urlKey = l.officialUrl.toLowerCase().trim()
      const existingUrls = seenUrls.get(urlKey) || []
      existingUrls.push(`${l.countryCode}: ${l.title}`)
      seenUrls.set(urlKey, existingUrls)
    }
  }

  const duplicateTitles = Array.from(seenTitles.entries()).filter(([, list]) => list.length > 1)
  const duplicateUrls = Array.from(seenUrls.entries()).filter(([, list]) => list.length > 1)

  // Countries with missing key categories
  const standardCategories = [
    'Cybercrime',
    'Data Protection',
    'Cybersecurity',
    'Electronic Transactions',
    'Critical Infrastructure',
    'Digital Evidence',
    'Online Fraud',
  ]

  const categoryCoverageByCountry: Record<string, string[]> = {}
  for (const c of countries) {
    const presentCats = new Set(c.laws.map((l) => l.category))
    const missingCats = standardCategories.filter((cat) => !presentCats.has(cat))
    categoryCoverageByCountry[c.isoCode] = missingCats
  }

  console.log('=== AUDIT RESULTS SUMMARY ===')
  console.log(`Total Countries: ${totalCountries}`)
  console.log(`Total Laws: ${totalLaws}`)
  console.log('Category Counts:', JSON.stringify(categoryCounts, null, 2))
  console.log(`Sample Data Count (isSampleData=true): ${sampleDataCount}`)
  console.log(`Missing/Placeholder Official URLs: ${missingOfficialUrls}`)
  console.log(`Missing/Placeholder Source URLs: ${missingSourceUrls}`)
  console.log(`Missing/Invalid Enactment Dates: ${missingDates}`)
  console.log(`Missing Authorities: ${missingAuthority}`)
  console.log(`Short/Vague Summaries: ${shortOrVagueSummary}`)
  console.log(`Duplicate Title Cases: ${duplicateTitles.length}`)
  if (duplicateTitles.length > 0) {
    console.log('Duplicate Titles:', JSON.stringify(duplicateTitles, null, 2))
  }
  console.log(`Duplicate Official URL Cases: ${duplicateUrls.length}`)
  if (duplicateUrls.length > 0) {
    console.log('Duplicate URLs:', JSON.stringify(duplicateUrls, null, 2))
  }

  console.log('\nDistribution of law counts across countries:')
  const distribution: Record<number, number> = {}
  for (const count of Object.values(countryCounts)) {
    distribution[count] = (distribution[count] || 0) + 1
  }
  console.log(JSON.stringify(distribution, null, 2))

  console.log('\nSample Country Category Gaps:')
  console.log('US Missing Categories:', categoryCoverageByCountry['US'])
  console.log('IN Missing Categories:', categoryCoverageByCountry['IN'])
  console.log('GB Missing Categories:', categoryCoverageByCountry['GB'])
  console.log('DE Missing Categories:', categoryCoverageByCountry['DE'])
}

runAudit()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
