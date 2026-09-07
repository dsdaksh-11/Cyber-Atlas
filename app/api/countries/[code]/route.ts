import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { normalizeCountryCode } from '@/lib/country-utils'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    if (!code) {
      return NextResponse.json({ error: 'Country code or name is required' }, { status: 400 })
    }

    const normalizedCode = normalizeCountryCode(code)

    const countryInclude = {
      coverages: {
        include: {
          category: true,
        },
        orderBy: {
          category: {
            displayOrder: 'asc' as const,
          },
        },
      },
      instruments: {
        include: {
          category: true,
          provisions: {
            orderBy: {
              displayOrder: 'asc' as const,
            },
          },
          sources: true,
          childInstruments: true,
        },
        orderBy: {
          yearEnacted: 'desc' as const,
        },
      },
      laws: {
        orderBy: {
          year: 'desc' as const,
        },
      },
    }

    // Try finding by ISO code first
    let country = await prisma.country.findFirst({
      where: {
        isoCode: {
          equals: normalizedCode,
        },
      },
      include: countryInclude,
    })

    // Fallback: match by country name case-insensitive
    if (!country) {
      country = await prisma.country.findFirst({
        where: {
          name: {
            equals: code.replace(/-/g, ' '),
          },
        },
        include: countryInclude,
      })
    }

    if (!country) {
      return NextResponse.json(
        {
          error: 'Country not found',
          message: `We currently do not have cyber law information available for '${code}'.`,
          suggestedCodes: ['IN', 'CN', 'US', 'GB'],
        },
        { status: 404 }
      )
    }

    return NextResponse.json(country)
  } catch (error) {
    console.error('Error fetching country:', error)
    return NextResponse.json(
      { error: 'Server error retrieving country cyber law information' },
      { status: 700 }
    )
  }
}
