import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { fetchAllLatestNews } from '@/lib/news-fetcher'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Optional secret key check for production protection if REFRESH_SECRET env variable is set
    const authHeader = req.headers.get('authorization')
    const secret = process.env.REFRESH_SECRET
    if (secret && authHeader !== `Bearer ${secret}`) {
      const isLocalhost = req.headers.get('host')?.includes('localhost') || req.headers.get('host')?.includes('127.0.0.1')
      if (!isLocalhost) {
        return NextResponse.json({ error: 'Unauthorized manual news refresh request.' }, { status: 401 })
      }
    }

    console.log('[NewsRefreshAPI] Starting manual news fetch & ingestion process...')

    const fetchedArticles = await fetchAllLatestNews()
    const totalFetched = fetchedArticles.length

    let relevantCount = 0
    let savedCount = 0
    let skippedDuplicates = 0

    for (const item of fetchedArticles) {
      if (!item.classification.isRelevant) {
        continue
      }
      relevantCount++

      // Check if articleUrl already exists
      const existing = await prisma.newsArticle.findFirst({
        where: {
          OR: [
            { articleUrl: item.articleUrl },
            { title: item.title, sourceName: item.sourceName },
          ],
        },
      })

      if (existing) {
        skippedDuplicates++
        continue
      }

      await prisma.newsArticle.create({
        data: {
          title: item.title,
          description: item.description,
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          articleUrl: item.articleUrl,
          imageUrl: item.imageUrl,
          author: item.author,
          publishedAt: item.publishedAt,
          category: item.classification.category,
          threatLevel: item.classification.threatLevel,
          relevanceScore: item.classification.relevanceScore,
          isRelevant: true,
        },
      })
      savedCount++
    }

    return NextResponse.json({
      success: true,
      message: 'AI Cybersecurity Intelligence news refresh executed successfully.',
      articlesFetched: totalFetched,
      articlesRelevant: relevantCount,
      articlesSaved: savedCount,
      duplicatesSkipped: skippedDuplicates,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error in POST /api/news/refresh:', error)
    return NextResponse.json(
      { error: 'Failed to refresh AI cybersecurity news feeds: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
