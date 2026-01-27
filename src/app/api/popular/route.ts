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

// Get popular news from multiple sources
async function fetchPopularNews(): Promise<PopularItem[]> {
  try {
    // Fetch from news API
    const res = await fetch('https://api.github.com/search/repositories?q=stars:>10000+created:>2024-01-01&sort=stars&order=desc&per_page=30', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-News-Bot'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    })
    
    if (res.ok) {
      const data = await res.json()
      
      if (data.items && Array.isArray(data.items)) {
        return data.items.slice(0, 12).map((repo: any, index: number) => ({
          id: String(repo.id),
          title: repo.description || `${repo.name}: A popular repository`,
          source: repo.owner.login,
          category: categorizeByLanguage(repo.language),
          views: formatStars(repo.stargazers_count),
          timestamp: getRelativeTime(new Date(repo.created_at)),
          url: repo.html_url,
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch popular news:', error)
  }
  
  // Fallback to Hacker News API
  try {
    const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&limitToFirst=15&orderBy=%22$key%22', {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000)
    })
    
    if (hnRes.ok) {
      const ids = await hnRes.json()
      const storyPromises = ids.slice(0, 12).map((id: number) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`, { signal: AbortSignal.timeout(5000) })
          .then(r => r.json())
      )
      
      const stories = await Promise.all(storyPromises)
      
      return stories.filter(Boolean).map((story: any, index: number) => ({
        id: String(story.id),
        title: story.title,
        source: story.by || 'Hacker News',
        category: 'Tech',
        views: formatNumber(story.score || 0),
        timestamp: getRelativeTime(new Date(story.time * 1000)),
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      }))
    }
  } catch (error) {
    console.error('Hacker News fetch error:', error)
  }
  
  // Return sample data as last resort
  return getSamplePopularNews()
}

function categorizeByLanguage(language: string): string {
  const categories: Record<string, string> = {
    'Python': 'Industry',
    'TypeScript': 'Industry',
    'JavaScript': 'Industry',
    'Go': 'Industry',
    'Rust': 'Industry',
    'Java': 'Industry',
    'C++': 'Industry',
    'Ruby': 'Industry',
    'Swift': 'Industry',
    'Kotlin': 'Industry',
  }
  return categories[language] || 'Apps'
}

function formatStars(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
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
    { id: '1', title: 'OpenAI GPT-5 Rumors: What We Know About the Next Generation', source: 'The Verge', category: 'Industry', views: '2.3M', timestamp: '2h', url: 'https://www.theverge.com' },
    { id: '2', title: 'EU Parliament Passes Comprehensive AI Act: Key Points', source: 'TechCrunch', category: 'Policy', views: '1.8M', timestamp: '4h', url: 'https://techcrunch.com' },
    { id: '3', title: 'NVIDIA CEO Reveals Roadmap for Next-Gen AI Chips', source: 'Reuters', category: 'Industry', views: '1.5M', timestamp: '6h', url: 'https://reuters.com' },
    { id: '4', title: 'Midjourney V7: Stunning New Features and Capabilities', source: 'Wired', category: 'Apps', views: '1.2M', timestamp: '8h', url: 'https://wired.com' },
    { id: '5', title: 'Google DeepMind AlphaFold 3: Drug Discovery Revolution', source: 'MIT Tech', category: 'Industry', views: '980K', timestamp: '10h', url: 'https://technologyreview.com' },
    { id: '6', title: 'Claude 3.5 vs GPT-4: The Ultimate Comparison', source: 'Ars Tech', category: 'Apps', views: '876K', timestamp: '12h', url: 'https://arstechnica.com' },
    { id: '7', title: 'China\'s New AI Regulations: What Companies Need', source: 'Bloomberg', category: 'Policy', views: '754K', timestamp: 'Yesterday', url: 'https://bloomberg.com' },
    { id: '8', title: 'Apple Silicon M4 Chip: AI Performance Breakthrough', source: 'The Verge', category: 'Industry', views: '689K', timestamp: 'Yesterday', url: 'https://www.theverge.com' },
    { id: '9', title: 'Runway Gen-3 Alpha: Text-to-Video Revolution', source: 'TechCrunch', category: 'Apps', views: '612K', timestamp: '2d', url: 'https://techcrunch.com' },
    { id: '10', title: 'Meta LLaMA 4 Leaks: Performance Benchmarks', source: 'Wired', category: 'Industry', views: '567K', timestamp: '2d', url: 'https://wired.com' },
    { id: '11', title: 'Tesla Optimus: New Demo Shows Humanoid Progress', source: 'Reuters', category: 'Industry', views: '523K', timestamp: '2d', url: 'https://reuters.com' },
    { id: '12', title: 'AI in Healthcare: FDA Approvals Hit Record High', source: 'MIT News', category: 'Apps', views: '498K', timestamp: '3d', url: 'https://news.mit.edu' },
  ]
}

export async function GET() {
  try {
    const popularNews = await fetchPopularNews()
    return NextResponse.json(popularNews)
  } catch (error) {
    console.error('Popular news error:', error)
    return NextResponse.json(getSamplePopularNews())
  }
}
