import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { normalizeCountryCode } from '@/lib/country-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const year = searchParams.get('year')
    const query = searchParams.get('q')

    const normalizedCode = normalizeCountryCode(code)

    // Find country
    const country = await prisma.country.findFirst({
      where: {
        OR: [
          { isoCode: { equals: normalizedCode } },
          { name: { equals: code.replace(/-/g, ' ') } },
        ],
      },
    })

    if (!country) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 })
    }

    // Build filter clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      countryId: country.id,
    }

    if (category && category !== 'All') {
      whereClause.category = {
        contains: category,
      }
    }

    if (year && !isNaN(parseInt(year, 10))) {
      whereClause.year = parseInt(year, 10)
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { summary: { contains: query } },
        { keyProvisions: { contains: query } },
        { authority: { contains: query } },
      ]
    }

    const laws = await prisma.cyberLaw.findMany({
      where: whereClause,
      orderBy: {
        year: 'desc',
      },
    })

    return NextResponse.json({
      country: {
        name: country.name,
        isoCode: country.isoCode,
        flagEmoji: country.flagEmoji,
      },
      count: laws.length,
      laws,
    })
  } catch (error) {
    console.error('Error fetching country laws:', error)
    return NextResponse.json(
      { error: 'Server error retrieving country cyber laws' },
      { status: 500 }
    )
  }
}
