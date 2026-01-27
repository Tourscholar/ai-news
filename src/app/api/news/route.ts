import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

interface NewsItem {
  id: string
  title: string
  source: string
  category: string
  timestamp: string
  url: string
}

const newsSources = [
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/ai-artificial-intelligence',
    category: 'application'
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/category/artificial-intelligence/',
    category: 'industry'
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence',
    category: 'industry'
  }
]

function categorizeNews(title: string, source: string): string {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('regulation') || lowerTitle.includes('law') || 
      lowerTitle.includes('ban') || lowerTitle.includes('EU') ||
      lowerTitle.includes('safety') || lowerTitle.includes('security') ||
      lowerTitle.includes('privacy') || lowerTitle.includes('risk')) {
    return 'policy'
  }
  
  if (lowerTitle.includes('launch') || lowerTitle.includes('release') ||
      lowerTitle.includes('introduce') || lowerTitle.includes('new ') ||
      lowerTitle.includes('update') || lowerTitle.includes('feature')) {
    return 'application'
  }
  
  if (lowerTitle.includes('google') || lowerTitle.includes('openai') ||
      lowerTitle.includes('microsoft') || lowerTitle.includes('nvidia') ||
      lowerTitle.includes('meta') || lowerTitle.includes('amazon') ||
      lowerTitle.includes('anthropic')) {
    return 'industry'
  }
  
  return 'other'
}

async function fetchTheVerge(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://www.theverge.com/ai-artificial-intelligence')
    const html = await res.text()
    const $ = cheerio.load(html)
    const news: NewsItem[] = []
    
    $('h2, h3').each((_, elem) => {
      const $elem = $(elem)
      const title = $elem.text().trim()
      const link = $elem.find('a').attr('href') || ''
      
      if (title.length > 20 && title.length < 200 && link.includes('theverge.com')) {
        const timestamp = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        
        news.push({
          id: `verge-${news.length}`,
          title,
          source: 'The Verge',
          category: categorizeNews(title, 'The Verge'),
          timestamp,
          url: link.startsWith('http') ? link : `https://www.theverge.com${link}`
        })
      }
    })
    
    return news.slice(0, 8)
  } catch (error) {
    console.error('Failed to fetch from The Verge:', error)
    return []
  }
}

async function fetchMITTechReview(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://www.technologyreview.com/topic/artificial-intelligence')
    const html = await res.text()
    const $ = cheerio.load(html)
    const news: NewsItem[] = []
    
    $('h2, h3').each((_, elem) => {
      const $elem = $(elem)
      const title = $elem.text().trim()
      const link = $elem.find('a').attr('href') || ''
      
      if (title.length > 20 && title.length < 200 && link.includes('technologyreview.com')) {
        const timestamp = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        
        news.push({
          id: `mit-${news.length}`,
          title,
          source: 'MIT Tech Review',
          category: categorizeNews(title, 'MIT Tech Review'),
          timestamp,
          url: link.startsWith('http') ? link : `https://www.technologyreview.com${link}`
        })
      }
    })
    
    return news.slice(0, 5)
  } catch (error) {
    console.error('Failed to fetch from MIT Tech Review:', error)
    return []
  }
}

export async function GET() {
  try {
    const [vergeNews, mitNews] = await Promise.all([
      fetchTheVerge(),
      fetchMITTechReview()
    ])
    
    const allNews = [...vergeNews, ...mitNews]
    
    // 如果没有获取到新闻，返回示例数据
    if (allNews.length === 0) {
      const sampleNews: NewsItem[] = [
        {
          id: 'sample-1',
          title: 'Nvidia debuts new AI weather models outperforming traditional forecasts',
          source: 'The Verge',
          category: 'industry',
          timestamp: 'Today',
          url: 'https://www.theverge.com'
        },
        {
          id: 'sample-2',
          title: 'EU launches investigation into xAI Grok image editing tools',
          source: 'The Verge',
          category: 'policy',
          timestamp: 'Today',
          url: 'https://www.theverge.com'
        },
        {
          id: 'sample-3',
          title: 'Google DeepMind acquires Hume AI in talent licensing deal',
          source: 'MIT Tech Review',
          category: 'industry',
          timestamp: 'Today',
          url: 'https://www.technologyreview.com'
        },
        {
          id: 'sample-4',
          title: 'OpenAI launches ChatGPT Atlas browser with tab groups',
          source: 'The Verge',
          category: 'application',
          timestamp: 'Today',
          url: 'https://www.theverge.com'
        },
        {
          id: 'sample-5',
          title: 'US lawmakers propose TRAIN Act for AI training data transparency',
          source: 'The Verge',
          category: 'policy',
          timestamp: 'Today',
          url: 'https://www.theverge.com'
        },
        {
          id: 'sample-6',
          title: 'Study warns AI toys pose risks to children development',
          source: 'MIT Tech Review',
          category: 'policy',
          timestamp: 'Today',
          url: 'https://www.technologyreview.com'
        },
        {
          id: 'sample-7',
          title: 'Meta to integrate AI models across all products',
          source: 'The Verge',
          category: 'application',
          timestamp: 'Today',
          url: 'https://www.theverge.com'
        },
        {
          id: 'sample-8',
          title: 'San Diego Comic-Con bans AI-generated art from exhibition',
          source: 'MIT Tech Review',
          category: 'other',
          timestamp: 'Today',
          url: 'https://www.technologyreview.com'
        }
      ]
      return NextResponse.json(sampleNews)
    }
    
    return NextResponse.json(allNews)
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
