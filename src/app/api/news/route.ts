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
      
      // Extract title
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                        itemContent.match(/<title>(.*?)<\/title>/)
      if (!titleMatch) continue
      
      const title = titleMatch[1].trim()
      if (title.length < 20 || title.toLowerCase().includes('feed') || 
          title.includes('RSS') || title.includes('404') || title.includes('Not Found')) continue
      
      // Extract link
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/)
      if (!linkMatch) continue
      
      const link = linkMatch[1].trim()
      
      // Extract pubDate
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
      const timestamp = pubDateMatch ? formatTimestamp(pubDateMatch[1]) : 'Recently'
      
      news.push({
        id: `${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${itemCount}-${Date.now()}`,
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
    // Silently fail for individual feeds
    return []
  }
}

async function fetchAI_news(): Promise<NewsItem[]> {
  // Main AI news sources
  const sources = [
    { url: 'https://news.mit.edu/rss/topic/artificial-intelligence2', source: 'MIT News' },
    { url: 'https://news.google.com/rss/search?q=artificial%20intelligence&hl=en-US&gl=US&ceid=US:en', source: 'Google News' },
    { url: 'https://news.ycombinator.com/rss?q=ai', source: 'Hacker News' },
  ]
  
  try {
    const results = await Promise.allSettled(
      sources.map(s => fetchRSS(s.url, s.source))
    )
    
    const allNews: NewsItem[] = []
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value)
      }
    })
    
    return allNews
  } catch (error) {
    return []
  }
}

async function fetchAuthoritativeNews(): Promise<NewsItem[]> {
  // Tech news sources
  const sources = [
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
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allNews.push(...result.value)
      }
    })
    
    return allNews
  } catch (error) {
    return []
  }
}

export async function GET() {
  try {
    // Fetch from multiple sources concurrently with shorter timeout
    const [mainNews, techNews] = await Promise.all([
      fetchAI_news(),
      fetchAuthoritativeNews()
    ])
    
    // Combine results
    let combinedNews = [...mainNews, ...techNews]
    
    // Deduplicate based on title
    const seenTitles = new Set<string>()
    const uniqueNews = combinedNews.filter(item => {
      const normalizedTitle = item.title.toLowerCase().trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
      if (seenTitles.has(normalizedTitle)) return false
      seenTitles.add(normalizedTitle)
      return true
    })
    
    // Sort by recency (newer first)
    uniqueNews.sort((a, b) => {
      const timeA = a.timestamp.replace(/[hd]/g, '').replace('Just now', '0').replace('Yesterday', '24')
      const timeB = b.timestamp.replace(/[hd]/g, '').replace('Just now', '0').replace('Yesterday', '24')
      const numA = parseInt(timeA) || 999
      const numB = parseInt(timeB) || 999
      return numA - numB
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
      source: 'Ars Technica',
      category: 'application',
      timestamp: 'Yesterday',
      url: 'https://arstechnica.com'
    }
  ]
}
