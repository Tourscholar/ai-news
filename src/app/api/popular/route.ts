import { NextResponse } from 'next/server'

interface PopularItem {
  id: string
  title: string
  source: string
  category: string
  views: string
  timestamp: string
  url: string
}

async function fetchHackerNews(): Promise<PopularItem[]> {
  try {
    // Get top stories IDs
    const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&limitToFirst=20&orderBy=%22$key%22', {
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    })
    
    if (!idsRes.ok) throw new Error('Failed to fetch HN IDs')
    
    const ids = await idsRes.json()
    
    // Fetch story details in parallel
    const storyPromises = ids.slice(0, 12).map((id: number) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(10000)
      }).then(res => res.json())
    )
    
    const stories = await Promise.all(storyPromises)
    
    return stories
      .filter((story: any) => story && story.url) // Only stories with URLs
      .map((story: any, index: number) => ({
        id: String(story.id),
        title: story.title,
        source: extractDomain(story.url),
        category: categorizeStory(story.url, story.title),
        views: formatNumber(story.score || 0),
        timestamp: getRelativeTime(new Date(story.time * 1000)),
        url: story.url,
      }))
  } catch (error) {
    console.error('Hacker News fetch error:', error)
    return getSamplePopularNews()
  }
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '').split('.')[0].toUpperCase()
  } catch {
    return 'HN'
  }
}

function categorizeStory(url: string, title: string): string {
  const lower = (url + ' ' + title).toLowerCase()
  
  if (lower.includes('ai') || lower.includes('gpt') || lower.includes('llm') || 
      lower.includes('openai') || lower.includes('anthropic') || lower.includes('google') ||
      lower.includes('microsoft') || lower.includes('nvidia')) {
    return 'Industry'
  }
  if (lower.includes('policy') || lower.includes('regulation') || lower.includes('eu ') ||
      lower.includes('ban') || lower.includes('law')) {
    return 'Policy'
  }
  if (lower.includes('launch') || lower.includes('release') || lower.includes('new ') ||
      lower.includes('introduce') || lower.includes('announce')) {
    return 'Apps'
  }
  return 'Tech'
}

function formatNumber(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 2) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getSamplePopularNews(): PopularItem[] {
  return [
    { id: '1', title: 'OpenAI GPT-5 Rumors: What We Know About the Next Generation', source: 'THE VERGE', category: 'Industry', views: '2.3K', timestamp: '2h', url: 'https://www.theverge.com' },
    { id: '2', title: 'EU Parliament Passes Comprehensive AI Act: Key Points', source: 'TECHCRUNCH', category: 'Policy', views: '1.8K', timestamp: '4h', url: 'https://techcrunch.com' },
    { id: '3', title: 'NVIDIA CEO Reveals Roadmap for Next-Gen AI Chips', source: 'REUTERS', category: 'Industry', views: '1.5K', timestamp: '6h', url: 'https://reuters.com' },
    { id: '4', title: 'Midjourney V7: Stunning New Features and Capabilities', source: 'WIRED', category: 'Apps', views: '1.2K', timestamp: '8h', url: 'https://wired.com' },
    { id: '5', title: 'Google DeepMind AlphaFold 3: Drug Discovery Revolution', source: 'MIT TECH', category: 'Industry', views: '980', timestamp: '10h', url: 'https://technologyreview.com' },
    { id: '6', title: 'Claude 3.5 vs GPT-4: The Ultimate Comparison', source: 'ARS TECH', category: 'Apps', views: '876', timestamp: '12h', url: 'https://arstechnica.com' },
    { id: '7', title: 'China\'s New AI Regulations: What Companies Need', source: 'BLOOMBERG', category: 'Policy', views: '754', timestamp: 'Yesterday', url: 'https://bloomberg.com' },
    { id: '8', title: 'Apple Silicon M4 Chip: AI Performance Breakthrough', source: 'THE VERGE', category: 'Industry', views: '689', timestamp: 'Yesterday', url: 'https://www.theverge.com' },
    { id: '9', title: 'Runway Gen-3 Alpha: Text-to-Video Revolution', source: 'TECHCRUNCH', category: 'Apps', views: '612', timestamp: '2d', url: 'https://techcrunch.com' },
    { id: '10', title: 'Meta LLaMA 4 Leaks: Performance Benchmarks', source: 'WIRED', category: 'Industry', views: '567', timestamp: '2d', url: 'https://wired.com' },
    { id: '11', title: 'Tesla Optimus: New Demo Shows Humanoid Progress', source: 'REUTERS', category: 'Industry', views: '523', timestamp: '2d', url: 'https://reuters.com' },
    { id: '12', title: 'AI in Healthcare: FDA Approvals Hit Record High', source: 'MIT NEWS', category: 'Apps', views: '498', timestamp: '3d', url: 'https://news.mit.edu' },
  ]
}

export async function GET() {
  try {
    const popularNews = await fetchHackerNews()
    return NextResponse.json(popularNews)
  } catch (error) {
    console.error('Popular news error:', error)
    return NextResponse.json(getSamplePopularNews())
  }
}
