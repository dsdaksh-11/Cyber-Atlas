import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const threatLevel = searchParams.get('threatLevel')
    const search = searchParams.get('search')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 40

    const whereClause: any = {
      isRelevant: true,
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      whereClause.category = category
    }

    if (threatLevel && threatLevel !== 'All') {
      whereClause.threatLevel = threatLevel
    }

    if (search && search.trim() !== '') {
      const q = search.trim()
      whereClause.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { sourceName: { contains: q } },
      ]
    }

    const articles = await prisma.newsArticle.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    })

    const totalCount = await prisma.newsArticle.count({
      where: whereClause,
    })

    return NextResponse.json({
      success: true,
      totalCount,
      articles,
    })
  } catch (error: any) {
    console.error('Error in GET /api/news:', error)
    return NextResponse.json(
      { error: 'An unexpected database error occurred while fetching news articles.' },
      { status: 500 }
    )
  }
}
