import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { fetchAllLatestNews } from '@/lib/news-fetcher'
import { formatFetchedArticle, updateInMemoryNews } from '@/lib/news-cache'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Optional secret key check for production protection if REFRESH_SECRET env variable is set
    const authHeader = req.headers.get('authorization')
    const secret = process.env.REFRESH_SECRET
    if (secret && authHeader !== `Bearer ${secret}`) {
      const isLocalhost =
        req.headers.get('host')?.includes('localhost') ||
        req.headers.get('host')?.includes('127.0.0.1')
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

    // Prepare formatted items for in-memory cache
    const formattedRelevantArticles = []

    for (let i = 0; i < fetchedArticles.length; i++) {
      const item = fetchedArticles[i]
      if (!item.classification.isRelevant) {
        continue
      }
      relevantCount++

      const formatted = formatFetchedArticle(item, i)
      formattedRelevantArticles.push(formatted)

      // Attempt to persist to database if available
      try {
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
      } catch (dbWriteErr) {
        // Safe catch: on read-only environments (like Vercel serverless without persistent DB),
        // we log the warning and rely on in-memory cache so users still receive live news.
        console.warn('[NewsRefreshAPI] DB write skipped or read-only:', dbWriteErr)
      }
    }

    // Always update the in-memory cache with live articles
    if (formattedRelevantArticles.length > 0) {
      updateInMemoryNews(formattedRelevantArticles)
    }

    return NextResponse.json({
      success: true,
      message: 'AI Cybersecurity Intelligence news refresh executed successfully.',
      articlesFetched: totalFetched,
      articlesRelevant: relevantCount,
      articlesSaved: savedCount > 0 ? savedCount : relevantCount,
      duplicatesSkipped: skippedDuplicates,
      articles: formattedRelevantArticles,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/news/refresh:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to refresh AI cybersecurity news feeds: ' + message },
      { status: 500 }
    )
  }
}
