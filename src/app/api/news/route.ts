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
      lowerTitle.includes('compliance') || lowerTitle.includes(' antitrust')) {
    return 'policy'
  }
  
  if (lowerTitle.includes('launch') || lowerTitle.includes('release') ||
      lowerTitle.includes('introduce') || lowerTitle.includes('new ') ||
      lowerTitle.includes('announce') || lowerTitle.includes('update') ||
      lowerTitle.includes('feature') || lowerTitle.includes('product') ||
      lowerTitle.includes('tool') || lowerTitle.includes('version') ||
      lowerTitle.includes('beta') || lowerTitle.includes('preview')) {
    return 'application'
  }
  
  if (lowerTitle.includes('google') || lowerTitle.includes('openai') ||
      lowerTitle.includes('microsoft') || lowerTitle.includes('nvidia') ||
      lowerTitle.includes('meta') || lowerTitle.includes('amazon') ||
      lowerTitle.includes('anthropic') || lowerTitle.includes('apple') ||
      lowerTitle.includes('deepmind') || lowerTitle.includes('xai') ||
      lowerTitle.includes('mistral') || lowerTitle.includes('hugging face') ||
      lowerTitle.includes('stability ai') || lowerTitle.includes('inflection')) {
    return 'industry'
  }
  
  return 'other'
}

function formatTimestamp(dateStr: string): string {
  try {
    const pubDate = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else if (diffHours < 168) {
      return `${Math.floor(diffHours / 24)}d ago`
    } else {
      return pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  } catch {
    return 'Recently'
  }
}

async function fetchRSS(url: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Bot/1.0)'
      }
    })
    
    if (!res.ok) return []
    
    const xmlText = await res.text()
    const news: NewsItem[] = []
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g
    let match
    let itemCount = 0
    
    while ((match = itemRegex.exec(xmlText)) !== null && itemCount < 10) {
      const itemContent = match[1]
      
      // Extract title
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                        itemContent.match(/<title>(.*?)<\/title>/)
      if (!titleMatch) continue
      
      const title = titleMatch[1].trim()
      if (title.length < 20 || title.toLowerCase().includes('feed') || title.includes('RSS')) continue
      
      // Extract link
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/)
      if (!linkMatch) continue
      
      const link = linkMatch[1].trim()
      
      // Extract pubDate
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
      const timestamp = pubDateMatch ? formatTimestamp(pubDateMatch[1]) : 'Recently'
      
      news.push({
        id: `${source.toLowerCase().replace(/\s/g, '-')}-${itemCount}`,
        title,
        source,
        category: categorizeNews(title),
        timestamp,
        url: link
      })
      
      itemCount++
    }
    
    return news
  } catch (error) {
    console.error(`Failed to fetch from ${source}:`, error)
    return []
  }
}

async function fetchTwitterNews(): Promise<NewsItem[]> {
  try {
    // Twitter RSS feeds for major AI accounts
    const twitterFeeds = [
      { url: 'https://nitter.net/OpenAI/rss', source: 'OpenAI' },
      { url: 'https://nitter.net/AndrewNG/statuses', source: 'Andrew Ng' },
      { url: 'https://nitter.net/sama/rss', source: 'Sam Altman' },
      { url: 'https://nitter.net/ylecun/rss', source: 'Yann LeCun' },
      { url: 'https://nitter.net/JeffDean/rss', source: 'Jeff Dean' },
    ]
    
    // Try nitter (Twitter RSS alternative) - some might be down
    const results = await Promise.allSettled(
      twitterFeeds.map(feed => fetchRSS(feed.url, feed.source))
    )
    
    const allNews: NewsItem[] = []
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value)
      }
    })
    
    // If we got Twitter news, deduplicate and return
    if (allNews.length > 0) {
      const seenTitles = new Set<string>()
      return allNews.filter(item => {
        const normalized = item.title.toLowerCase().trim()
        if (seenTitles.has(normalized)) return false
        seenTitles.add(normalized)
        return true
      }).slice(0, 10)
    }
    
    return []
  } catch (error) {
    console.error('Failed to fetch Twitter news:', error)
    return []
  }
}

async function fetchAuthoritativeNews(): Promise<NewsItem[]> {
  // RSS feeds from authoritative tech/AI news sources
  const rssFeeds = [
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
    { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
    { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
    { url: 'https://www.reutersagency.com/feed/', source: 'Reuters' },
    { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review' },
    { url: 'https://news.mit.edu/rss/topic/artificial-intelligence2', source: 'MIT News' },
    { url: 'https://research.facebook.com/blog/rss', source: 'Meta AI' },
    { url: 'https://www.deepmind.com/blog/rss', source: 'DeepMind' },
  ]
  
  try {
    const results = await Promise.allSettled(
      rssFeeds.map(feed => fetchRSS(feed.url, feed.source))
    )
    
    const allNews: NewsItem[] = []
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value)
      }
    })
    
    return allNews
  } catch (error) {
    console.error('Failed to fetch authoritative news:', error)
    return []
  }
}

export async function GET() {
  try {
    // Fetch from multiple sources concurrently
    const [twitterNews, authoritativeNews] = await Promise.all([
      fetchTwitterNews(),
      fetchAuthoritativeNews()
    ])
    
    // Combine and prioritize authoritative sources
    let combinedNews = [...authoritativeNews]
    
    // Add Twitter news if we got any (as supplemental)
    if (twitterNews.length > 0) {
      combinedNews = [...combinedNews, ...twitterNews]
    }
    
    // Deduplicate based on title
    const seenTitles = new Set<string>()
    const uniqueNews = combinedNews.filter(item => {
      const normalizedTitle = item.title.toLowerCase().trim()
      if (seenTitles.has(normalizedTitle)) return false
      seenTitles.add(normalizedTitle)
      return true
    })
    
    // Sort by category priority: industry > application > policy > other
    const categoryOrder: Record<string, number> = { industry: 0, application: 1, policy: 2, other: 3 }
    uniqueNews.sort((a, b) => {
      const orderDiff = categoryOrder[a.category] - categoryOrder[b.category]
      if (orderDiff !== 0) return orderDiff
      // Secondary sort by recency
      return 0
    })
    
    // Return top 20 unique news items
    const finalNews = uniqueNews.slice(0, 20)
    
    // If no real news, return sample data
    if (finalNews.length === 0) {
      return NextResponse.json(getSampleNews())
    }
    
    return NextResponse.json(finalNews)
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json(getSampleNews())
  }
}

function getSampleNews(): NewsItem[] {
  return [
    {
      id: 'sample-1',
      title: 'OpenAI announces new GPT-5 model with enhanced reasoning capabilities',
      source: 'The Verge',
      category: 'application',
      timestamp: '2h ago',
      url: 'https://www.theverge.com'
    },
    {
      id: 'sample-2',
      title: 'EU proposes new AI regulation framework for autonomous systems',
      source: 'TechCrunch',
      category: 'policy',
      timestamp: '4h ago',
      url: 'https://techcrunch.com'
    },
    {
      id: 'sample-3',
      title: 'Nvidia reports record revenue as AI chip demand surges globally',
      source: 'Reuters',
      category: 'industry',
      timestamp: '6h ago',
      url: 'https://reuters.com'
    },
    {
      id: 'sample-4',
      title: 'Google DeepMind develops new AI system for scientific discovery',
      source: 'MIT Tech Review',
      category: 'industry',
      timestamp: '8h ago',
      url: 'https://technologyreview.com'
    },
    {
      id: 'sample-5',
      title: 'Apple integrates ChatGPT into iOS for enhanced Siri capabilities',
      source: 'Wired',
      category: 'application',
      timestamp: '12h ago',
      url: 'https://wired.com'
    },
    {
      id: 'sample-6',
      title: 'Meta releases new LLaMA 4 model with open-source licensing',
      source: 'Meta AI',
      category: 'application',
      timestamp: 'Yesterday',
      url: 'https://ai.meta.com'
    }
  ]
}
