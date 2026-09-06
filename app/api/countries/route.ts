import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { laws: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(countries)
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve country cyber law catalog' },
      { status: 500 }
    )
  }
}
