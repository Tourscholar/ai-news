import { NextResponse } from 'next/server'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  stars: number
  forks: number
  language: string
  author: string
  avatar: string
  url: string
  starsThisWeek: number
}

export async function GET() {
  try {
    // Try multiple sources
    const sources = [
      // Source 1: GitHub Trending via RSS (more reliable)
      { url: 'https://github-trending-api.pages.dev/repos?language=&since=weekly', parse: parseAPIResponse },
      // Source 2: Alternative trending API
      { url: 'https://ghproxy.net/https://raw.githubusercontent.com/josephz/web-trending-repos/main/data/weekly.json', parse: parseWeeklyJSON },
    ]
    
    for (const source of sources) {
      try {
        const res = await fetch(source.url, {
          next: { revalidate: 1800 },
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(10000)
        })
        
        if (res.ok) {
          const data = await res.json()
          const repos = source.parse(data)
          if (repos.length > 0) {
            return NextResponse.json(repos)
          }
        }
      } catch (e) {
        console.log(`Source ${source.url} failed, trying next...`)
      }
    }
    
    // If all sources fail, use static sample data
    return NextResponse.json(getSampleRepos())
  } catch (error) {
    console.error('GitHub trending error:', error)
    return NextResponse.json(getSampleRepos())
  }
}

function parseAPIResponse(data: any): GitHubRepo[] {
  if (!Array.isArray(data)) return []
  
  return data.slice(0, 12).map((repo: any, index: number) => ({
    id: repo.id || index,
    name: repo.name || repo.repo?.name || 'unknown',
    full_name: repo.full_name || repo.repo?.path || 'unknown/unknown',
    description: repo.description || repo.repo?.description || 'No description',
    stars: repo.stars || repo.starsCount || 0,
    forks: repo.forks || repo.forksCount || 0,
    language: repo.language || repo.repo?.language || 'Unknown',
    author: repo.author || repo.repo?.owner?.username || 'unknown',
    avatar: repo.avatar || repo.repo?.owner?.avatar || `https://github.com/${repo.author}.png`,
    url: repo.url || `https://github.com/${repo.full_name || repo.repo?.path}`,
    starsThisWeek: repo.starsThisWeek || repo.todayStars || Math.floor((repo.stars || 0) / 30)
  }))
}

function parseWeeklyJSON(data: any): GitHubRepo[] {
  if (!Array.isArray(data)) return []
  
  return data.slice(0, 12).map((repo: any, index: number) => ({
    id: index,
    name: repo.name,
    full_name: repo.fullName,
    description: repo.description || 'No description',
    stars: repo.stars || repo.stargazersCount || 0,
    forks: repo.forks || repo.forksCount || 0,
    language: repo.language || 'Unknown',
    author: repo.author || repo.owner?.username || 'unknown',
    avatar: repo.avatar || `https://github.com/${repo.author}.png`,
    url: repo.url || `https://github.com/${repo.fullName}`,
    starsThisWeek: repo.starsThisWeek || Math.floor((repo.stars || 0) / 30)
  }))
}

function getSampleRepos(): GitHubRepo[] {
  return [
    { id: 1, name: 'openManus', full_name: 'Maaaar-v/openManus', description: 'Everyone can own their AI agents.', stars: 4200, forks: 520, language: 'Python', author: 'Maaaar-v', avatar: 'https://avatars.githubusercontent.com/u/62394968?v=4', url: 'https://github.com/Maaaar-v/openManus', starsThisWeek: 890 },
    { id: 2, name: 'browser-use', full_name: 'browser-use/browser-use', description: 'Make your browser agentic with Python.', stars: 3800, forks: 480, language: 'Python', author: 'browser-use', avatar: 'https://avatars.githubusercontent.com/u/174253489?s=200&v=4', url: 'https://github.com/browser-use/browser-use', starsThisWeek: 720 },
    { id: 3, name: 'swarm', full_name: 'openai/swarm', description: 'Educational framework for multi-agent coordination.', stars: 5500, forks: 620, language: 'Python', author: 'openai', avatar: 'https://avatars.githubusercontent.com/u/149570838?s=200&v=4', url: 'https://github.com/openai/swarm', starsThisWeek: 1200 },
    { id: 4, name: 'ChatTTS', full_name: '2noise/ChatTTS', description: 'A generative speech model for daily dialogue.', stars: 4800, forks: 550, language: 'Python', author: '2noise', avatar: 'https://avatars.githubusercontent.com/u/117076017?v=4', url: 'https://github.com/2noise/ChatTTS', starsThisWeek: 950 },
    { id: 5, name: 'g1', full_name: 'bklieger-groq/g1', description: 'Create reasoning AI agents with Groq.', stars: 4100, forks: 390, language: 'Python', author: 'bklieger-groq', avatar: 'https://avatars.githubusercontent.com/u/180834104?s=200&v=4', url: 'https://github.com/bklieger-groq/g1', starsThisWeek: 680 },
    { id: 6, name: 'dora-rs', full_name: 'dora-rs/dora', description: 'Build dataflow pipelines with Rust and Python.', stars: 3200, forks: 280, language: 'Rust', author: 'dora-rs', avatar: 'https://avatars.githubusercontent.com/u/100666689?s=200&v=4', url: 'https://github.com/dora-rs/dora', starsThisWeek: 450 },
    { id: 7, name: 'ruler', full_name: 'meta/ruler', description: 'A scalable approach to LLM evaluation.', stars: 3600, forks: 320, language: 'Python', author: 'meta', avatar: 'https://avatars.githubusercontent.com/u/6154722?v=4', url: 'https://github.com/meta/ruler', starsThisWeek: 520 },
    { id: 8, name: 'devika', full_name: 'stition-ai/devika', description: 'AI software engineer agent.', stars: 3400, forks: 360, language: 'Python', author: 'stition-ai', avatar: 'https://avatars.githubusercontent.com/u/149944854?s=200&v=4', url: 'https://github.com/stition-ai/devika', starsThisWeek: 480 },
    { id: 9, name: 'suno-bark', full_name: 'suno-ai/bark', description: 'Text-prompted generative audio model.', stars: 4500, forks: 580, language: 'Python', author: 'suno-ai', avatar: 'https://avatars.githubusercontent.com/u/126736589?s=200&v=4', url: 'https://github.com/suno-ai/bark', starsThisWeek: 620 },
    { id: 10, name: 'memfree', full_name: 'memfreeme/memfree', description: 'Open source hybrid AI search engine.', stars: 3100, forks: 280, language: 'TypeScript', author: 'memfreeme', avatar: 'https://avatars.githubusercontent.com/u/124452456?s=200&v=4', url: 'https://github.com/memfreeme/memfree', starsThisWeek: 420 },
    { id: 11, name: 'novita-ai', full_name: 'novita-ai/novita', description: 'Fast and scalable LLM API.', stars: 2900, forks: 250, language: 'Python', author: 'novita-ai', avatar: 'https://avatars.githubusercontent.com/u/133175152?s=200&v=4', url: 'https://github.com/novita-ai/novita', starsThisWeek: 380 },
    { id: 12, name: 'LLaMA-Factory', full_name: 'hiyouga/LLaMA-Factory', description: 'Unified Efficient Fine-Tuning of 100+ LLMs.', stars: 6200, forks: 720, language: 'Python', author: 'hiyouga', avatar: 'https://avatars.githubusercontent.com/u/16510576?v=4', url: 'https://github.com/hiyouga/LLaMA-Factory', starsThisWeek: 850 }
  ]
}
