import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const countryCount = await prisma.country.count()
  const lawCount = await prisma.cyberLaw.count()
  const newsCount = await prisma.newsArticle.count()

  console.log('=== CURRENT DATABASE STATE ===')
  console.log(`Total Countries: ${countryCount}`)
  console.log(`Total Cyber Laws: ${lawCount}`)
  console.log(`Total News Articles: ${newsCount}`)

  const countries = await prisma.country.findMany({
    include: {
      laws: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  let withLaws = 0
  let withoutLaws = 0

  for (const c of countries) {
    if (c.laws.length > 0) {
      withLaws++
      console.log(`[HAS LAWS] ${c.name} (${c.isoCode}) — ${c.laws.length} laws: ${c.laws.map(l => l.title).join(', ')}`)
    } else {
      withoutLaws++
      console.log(`[NO LAWS]  ${c.name} (${c.isoCode}) — 0 laws`)
    }
  }

  console.log(`\nSummary: ${withLaws} countries with laws, ${withoutLaws} countries without laws.`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
