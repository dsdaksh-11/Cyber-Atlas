import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('====================================================')
  console.log('            CYBERLAW ATLAS - DATABASE VERIFICATION  ')
  console.log('====================================================\n')

  try {
    const totalCountries = await prisma.country.count()
    const totalCyberLaws = await prisma.cyberLaw.count()
    const totalNewsArticles = await prisma.newsArticle.count()

    const countries = await prisma.country.findMany({
      include: {
        laws: {
          orderBy: { year: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    const countriesWithLaws = countries.filter((c) => c.laws.length > 0)
    const countriesWithoutLaws = countries.filter((c) => c.laws.length === 0)

    console.log(`Total Countries:    ${totalCountries}`)
    console.log(`Total Cyber Laws:   ${totalCyberLaws}`)
    console.log(`Total News Alerts:  ${totalNewsArticles}`)
    console.log(`\nCountries with laws:    ${countriesWithLaws.length}`)
    console.log(`Countries without laws: ${countriesWithoutLaws.length}\n`)

    console.log('----------------------------------------------------')
    console.log('           JURISDICTION BREAKDOWN & STATUTES        ')
    console.log('----------------------------------------------------')

    for (const country of countries) {
      const statusIcon = country.laws.length > 0 ? '✓' : '✗'
      console.log(
        `${statusIcon} ${country.flagEmoji} ${country.name} (${country.isoCode}) [${country.region}]: ${country.laws.length} laws`
      )
      for (const law of country.laws) {
        console.log(`    • [${law.year}] [${law.category}] ${law.title}`)
      }
    }

    console.log('\n====================================================')
    if (countriesWithoutLaws.length === 0 && totalCountries >= 48 && totalCyberLaws > 0) {
      console.log('✅ ALL 48 JURISDICTIONS HAVE PERSISTED CYBER LAWS!')
    } else if (countriesWithoutLaws.length > 0) {
      console.log(`⚠️  ${countriesWithoutLaws.length} countries currently have no cyber laws in the database.`)
    }
    console.log('====================================================\n')
  } catch (error) {
    console.error('❌ Database verification encountered an error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()
