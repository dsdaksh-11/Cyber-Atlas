import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getLiveOrCachedNews } from '@/lib/news-cache'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const threatLevel = searchParams.get('threatLevel')
  const search = searchParams.get('search')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? parseInt(limitParam, 10) : 40

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // If database returned articles, respond immediately
    if (articles.length > 0) {
      return NextResponse.json({
        success: true,
        totalCount,
        articles,
      })
    }

    // If database is empty, fallback to live cached RSS articles
    const fallback = await getLiveOrCachedNews(category, threatLevel, search, limit)
    return NextResponse.json({
      success: true,
      totalCount: fallback.totalCount,
      articles: fallback.articles,
    })
  } catch (error: unknown) {
    console.warn('[GET /api/news] Database query failed, switching to live RSS fallback:', error)

    try {
      const fallback = await getLiveOrCachedNews(category, threatLevel, search, limit)
      return NextResponse.json({
        success: true,
        totalCount: fallback.totalCount,
        articles: fallback.articles,
      })
    } catch (fallbackErr: unknown) {
      console.error('[GET /api/news] Live fallback error:', fallbackErr)
      return NextResponse.json(
        { error: 'Failed to load news articles from both database and feed sources.' },
        { status: 500 }
      )
    }
  }
}
