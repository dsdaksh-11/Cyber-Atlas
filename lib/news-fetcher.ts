/**
 * RSS / XML Feed Fetcher and Normalizer for Cybersecurity News.
 * Strictly uses public RSS endpoints without requiring paid API keys.
 */

import { classifyArticle, ClassificationResult } from './news-classifier'

export interface FetchedArticle {
  title: string
  description: string
  sourceName: string
  sourceUrl: string
  articleUrl: string
  imageUrl?: string
  author?: string
  publishedAt: Date
  classification: ClassificationResult
}

export interface NewsFeedSource {
  name: string
  siteUrl: string
  feedUrl: string
}

export const RSS_SOURCES: NewsFeedSource[] = [
  {
    name: 'CISA Cybersecurity Alerts',
    siteUrl: 'https://www.cisa.gov',
    feedUrl: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
  },
  {
    name: 'The Hacker News',
    siteUrl: 'https://thehackernews.com',
    feedUrl: 'https://feeds.feedburner.com/TheHackersNews',
  },
  {
    name: 'BleepingComputer',
    siteUrl: 'https://www.bleepingcomputer.com',
    feedUrl: 'https://www.bleepingcomputer.com/feed/',
  },
  {
    name: 'SecurityWeek',
    siteUrl: 'https://www.securityweek.com',
    feedUrl: 'https://www.securityweek.com/feed/',
  },
  {
    name: 'Krebs on Security',
    siteUrl: 'https://krebsonsecurity.com',
    feedUrl: 'https://krebsonsecurity.com/feed/',
  },
]

// Simple robust regex XML tag parser
function extractTagContent(xml: string, tagName: string): string {
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tagName}>`, 'i')
  const cdataMatch = xml.match(cdataRegex)
  if (cdataMatch) return cdataMatch[1].trim()

  const standardRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i')
  const match = xml.match(standardRegex)
  if (match) {
    return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
  }

  return ''
}

function extractAttribute(xml: string, tagName: string, attrName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*${attrName}=["']([^"']+)["'][^>]*>`, 'i')
  const match = xml.match(regex)
  return match ? match[1] : ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim()
}

export async function fetchNewsFromFeed(source: NewsFeedSource): Promise<FetchedArticle[]> {
  const articles: FetchedArticle[] = []

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(source.feedUrl, {
      headers: {
        'User-Agent': 'CyberLawAtlas-IntelligenceBot/1.0 (+https://cyberlawatlas.org)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      console.warn(`[NewsFetcher] Failed to fetch ${source.name} (${res.status})`)
      return []
    }

    const xmlText = await res.text()

    // Match all <item> or <entry> blocks
    const itemRegex = /<(item|entry)[\s\S]*?<\/\1>/gi
    const items = xmlText.match(itemRegex) || []

    for (const itemXml of items.slice(0, 15)) {
      const rawTitle = extractTagContent(itemXml, 'title')
      let rawLink = extractTagContent(itemXml, 'link')
      if (!rawLink) {
        rawLink = extractAttribute(itemXml, 'link', 'href')
      }
      const rawDesc = extractTagContent(itemXml, 'description') || extractTagContent(itemXml, 'content') || extractTagContent(itemXml, 'summary')
      const rawPubDate = extractTagContent(itemXml, 'pubDate') || extractTagContent(itemXml, 'published') || extractTagContent(itemXml, 'dc:date')
      const author = extractTagContent(itemXml, 'author') || extractTagContent(itemXml, 'dc:creator') || source.name

      // Image extraction
      let imageUrl = extractAttribute(itemXml, 'media:content', 'url') || extractAttribute(itemXml, 'enclosure', 'url')
      if (!imageUrl) {
        const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i)
        if (imgMatch) imageUrl = imgMatch[1]
      }

      const cleanTitle = stripHtml(rawTitle)
      const cleanDesc = stripHtml(rawDesc).slice(0, 300)

      if (!cleanTitle || !rawLink) continue

      const publishedAt = rawPubDate ? new Date(rawPubDate) : new Date()
      const classification = classifyArticle(cleanTitle, cleanDesc)

      articles.push({
        title: cleanTitle,
        description: cleanDesc || `${cleanTitle} - Reported by ${source.name}`,
        sourceName: source.name,
        sourceUrl: source.siteUrl,
        articleUrl: rawLink.trim(),
        imageUrl: imageUrl || undefined,
        author: author ? stripHtml(author) : undefined,
        publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        classification,
      })
    }
  } catch (err: any) {
    console.error(`[NewsFetcher] Error fetching ${source.name}:`, err.message)
  }

  return articles
}

export async function fetchAllLatestNews(): Promise<FetchedArticle[]> {
  const allResults = await Promise.allSettled(
    RSS_SOURCES.map(source => fetchNewsFromFeed(source))
  )

  const combined: FetchedArticle[] = []
  for (const res of allResults) {
    if (res.status === 'fulfilled') {
      combined.push(...res.value)
    }
  }

  return combined
}
