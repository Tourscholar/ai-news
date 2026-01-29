import { NextResponse } from 'next/server'

interface NewsItem {
  id: string
  title: string
  source: string
  category: string
  timestamp: string
  url: string
}

function categorizeNews(title: string): string {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('regulation') || lowerTitle.includes('law') ||
      lowerTitle.includes('ban') || lowerTitle.includes('eu ') ||
      lowerTitle.includes('safety') || lowerTitle.includes('security') ||
      lowerTitle.includes('privacy') || lowerTitle.includes('risk') ||
      lowerTitle.includes('govern') || lowerTitle.includes('policy') ||
      lowerTitle.includes('compliance') || lowerTitle.includes('antitrust') ||
      lowerTitle.includes('congress') || lowerTitle.includes('legislation')) {
    return 'policy'
  }

  if (lowerTitle.includes('launch') || lowerTitle.includes('release') ||
      lowerTitle.includes('introduce') || lowerTitle.includes('new ') ||
      lowerTitle.includes('announce') || lowerTitle.includes('update') ||
      lowerTitle.includes('feature') || lowerTitle.includes('product') ||
      lowerTitle.includes('tool') || lowerTitle.includes('version') ||
      lowerTitle.includes('beta') || lowerTitle.includes('preview') ||
      lowerTitle.includes('launches') || lowerTitle.includes('releases')) {
    return 'application'
  }

  if (lowerTitle.includes('google') || lowerTitle.includes('openai') ||
      lowerTitle.includes('microsoft') || lowerTitle.includes('nvidia') ||
      lowerTitle.includes('meta') || lowerTitle.includes('amazon') ||
      lowerTitle.includes('anthropic') || lowerTitle.includes('apple') ||
      lowerTitle.includes('deepmind') || lowerTitle.includes('xai') ||
      lowerTitle.includes('mistral') || lowerTitle.includes('hugging face') ||
      lowerTitle.includes('stability ai') || lowerTitle.includes('inflection') ||
      lowerTitle.includes('runway') || lowerTitle.includes('midjourney')) {
    return 'industry'
  }

  return 'other'
}

function parseRFC822Date(dateStr: string): string {
  try {
    const pubDate = new Date(dateStr)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = days[pubDate.getUTCDay()]
    const month = months[pubDate.getUTCMonth()]
    const date = pubDate.getUTCDate().toString().padStart(2, '0')
    const year = pubDate.getUTCFullYear()
    const hours = pubDate.getUTCHours().toString().padStart(2, '0')
    const minutes = pubDate.getUTCMinutes().toString().padStart(2, '0')
    const seconds = pubDate.getUTCSeconds().toString().padStart(2, '0')
    return `${day}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`
  } catch {
    return new Date().toUTCString()
  }
}

async function fetchRSS(url: string, source: string, timeout = 10000): Promise<NewsItem[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!res.ok) return []

    const xmlText = await res.text()
    const news: NewsItem[] = []
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g
    let match
    let itemCount = 0

    while ((match = itemRegex.exec(xmlText)) !== null && itemCount < 8) {
      const itemContent = match[1]

      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                        itemContent.match(/<title>(.*?)<\/title>/)
      if (!titleMatch) continue

      const title = titleMatch[1].trim()
      if (title.length < 20 || title.toLowerCase().includes('feed') ||
          title.includes('RSS') || title.includes('404') || title.includes('Not Found')) continue

      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/)
      if (!linkMatch) continue

      const link = linkMatch[1].trim()
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
      const timestamp = pubDateMatch ? pubDateMatch[1] : new Date().toISOString()

      news.push({
        id: `${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${itemCount}`,
        title,
        source,
        category: categorizeNews(title),
        timestamp,
        url: link
      })

      itemCount++
    }

    return news
  } catch {
    return []
  }
}

async function fetchAllNews(): Promise<NewsItem[]> {
  const sources = [
    { url: 'https://news.mit.edu/rss/topic/artificial-intelligence2', source: 'MIT News' },
    { url: 'https://news.google.com/rss/search?q=artificial%20intelligence&hl=en-US&gl=US&ceid=US:en', source: 'Google News' },
    { url: 'https://news.ycombinator.com/rss?q=ai', source: 'Hacker News' },
    { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
    { url: 'https://www.wired.com/feed/category/science/latest/rss', source: 'Wired' },
    { url: 'https://arstechnica.com/feed/', source: 'Ars Technica' },
    { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review' },
  ]

  try {
    const results = await Promise.allSettled(
      sources.map(s => fetchRSS(s.url, s.source, 8000))
    )

    const allNews: NewsItem[] = []
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value)
      }
    })

    return allNews
  } catch {
    return []
  }
}

function generateRSS(news: NewsItem[]): string {
  const siteUrl = 'https://ai-news-bice.vercel.app'
  const lastBuildDate = new Date().toUTCString()

  const itemsXml = news.map(item => {
    const pubDate = parseRFC822Date(item.timestamp)
    const escapedTitle = item.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

    return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.source} | ${item.category}]]></description>
      <source><![CDATA[${item.source}]]></source>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI News Daily - Latest AI News</title>
    <link>${siteUrl}</link>
    <description>每日 AI 新闻资讯聚合 - Aggregated AI news from multiple sources</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastBuildDate}</pubDate>
    <ttl>30</ttl>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/icon-192.png</url>
      <title>AI News Daily</title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`
}

export async function GET() {
  try {
    const news = await fetchAllNews()

    // Deduplicate
    const seenTitles = new Set<string>()
    const uniqueNews = news.filter(item => {
      const normalizedTitle = item.title.toLowerCase().trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
      if (seenTitles.has(normalizedTitle)) return false
      seenTitles.add(normalizedTitle)
      return true
    })

    // Sort by date (newer first)
    uniqueNews.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return dateB - dateA
    })

    const finalNews = uniqueNews.slice(0, 30)
    const rss = generateRSS(finalNews)

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}
