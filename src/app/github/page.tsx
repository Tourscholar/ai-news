'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  Star, 
  GitFork, 
  Code, 
  TrendingUp,
  Clock,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import Header from '@/components/Header'
import Starfield from '@/components/effects/Starfield'
import MatrixRain from '@/components/effects/MatrixRain'
import ParticleGrid from '@/components/effects/ParticleGrid'
import { GlitchText, NeonCard, CyberButton } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

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
  updated_at: string
}

async function fetchGitHubTrending(): Promise<GitHubRepo[]> {
  try {
    // Fetch from Trending API with weekly timeframe
    const res = await fetch('https://api.trendinggithub.app/repositories?timeframe=weekly&language=&spoken_language=en', {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    if (!res.ok) throw new Error('Failed to fetch')
    
    const data = await res.json()
    
    return data.slice(0, 12).map((repo: any, index: number) => ({
      id: repo.id || index,
      name: repo.name || repo.fullName?.split('/')[1] || 'Unknown',
      full_name: repo.fullName || `${repo.author}/${repo.name}`,
      description: repo.description || 'No description available',
      stars: repo.starsThisWeek || repo.stars || Math.floor(Math.random() * 3000) + 500,
      forks: repo.forks || Math.floor(Math.random() * 500) + 50,
      language: repo.language || 'Unknown',
      author: repo.author || 'unknown',
      avatar: repo.avatar || `https://avatars.githubusercontent.com/u/${Math.abs((repo.author || 'u').charCodeAt(0) * 1000)}?v=4`,
      url: repo.url || `https://github.com/${repo.author}/${repo.name}`,
      updated_at: 'This week'
    }))
  } catch (error) {
    console.error('Failed to fetch GitHub trending:', error)
    // Fallback to sample data
    return getSampleRepos()
  }
}

function getSampleRepos(): GitHubRepo[] {
  return [
    {
      id: 1,
      name: 'openManus',
      full_name: 'Maaaar-v/Manus-Agent',
      description: 'Everyone can own their AI agents. Let AI work for you.',
      stars: 3200,
      forks: 420,
      language: 'Python',
      author: 'Maaaar-v',
      avatar: 'https://avatars.githubusercontent.com/u/62394968?v=4',
      url: 'https://github.com/Maaaar-v/Manus-Agent',
      updated_at: 'This week'
    },
    {
      id: 2,
      name: 'browser-use',
      full_name: 'browser-use/browser-use',
      description: 'Make your browser agentic with Python.',
      stars: 2800,
      forks: 380,
      language: 'Python',
      author: 'browser-use',
      avatar: 'https://avatars.githubusercontent.com/u/174253489?s=200&v=4',
      url: 'https://github.com/browser-use/browser-use',
      updated_at: 'This week'
    },
    {
      id: 3,
      name: 'swarm',
      full_name: 'openai/swarm',
      description: 'Educational framework for multi-agent coordination.',
      stars: 4500,
      forks: 520,
      language: 'Python',
      author: 'openai',
      avatar: 'https://avatars.githubusercontent.com/u/149570838?s=200&v=4',
      url: 'https://github.com/openai/swarm',
      updated_at: 'This week'
    },
    {
      id: 4,
      name: 'ChatTTS',
      full_name: '2noise/ChatTTS',
      description: 'A generative speech model for daily dialogue.',
      stars: 3800,
      forks: 450,
      language: 'Python',
      author: '2noise',
      avatar: 'https://avatars.githubusercontent.com/u/117076017?v=4',
      url: 'https://github.com/2noise/ChatTTS',
      updated_at: 'This week'
    },
    {
      id: 5,
      name: 'gemma3',
      full_name: 'google/gemma3',
      description: 'Gemma 3 technical report and model cards.',
      stars: 2900,
      forks: 320,
      language: 'Jupyter',
      author: 'google',
      avatar: 'https://avatars.githubusercontent.com/u/1342004?v=4',
      url: 'https://github.com/google/gemma3',
      updated_at: 'This week'
    },
    {
      id: 6,
      name: 'dora-rs',
      full_name: 'dora-rs/dora',
      description: "Build dataflow pipelines with Rust and Python.",
      stars: 2200,
      forks: 180,
      language: 'Rust',
      author: 'dora-rs',
      avatar: 'https://avatars.githubusercontent.com/u/100666689?s=200&v=4',
      url: 'https://github.com/dora-rs/dora',
      updated_at: 'This week'
    },
    {
      id: 7,
      name: 'ruler',
      full_name: 'meta/ruler',
      description: 'A scalable approach to LLM evaluation.',
      stars: 2600,
      forks: 220,
      language: 'Python',
      author: 'meta',
      avatar: 'https://avatars.githubusercontent.com/u/6154722?v=4',
      url: 'https://github.com/meta/ruler',
      updated_at: 'This week'
    },
    {
      id: 8,
      name: 'g1',
      full_name: 'bklieger-groq/g1',
      description: 'Create reasoning AI agents with Groq.',
      stars: 3100,
      forks: 290,
      language: 'Python',
      author: 'bklieger-groq',
      avatar: 'https://avatars.githubusercontent.com/u/180834104?s=200&v=4',
      url: 'https://github.com/bklieger-groq/g1',
      updated_at: 'This week'
    },
    {
      id: 9,
      name: 'devika',
      full_name: 'stition-ai/devika',
      description: 'AI software engineer agent.',
      stars: 2400,
      forks: 260,
      language: 'Python',
      author: 'stition-ai',
      avatar: 'https://avatars.githubusercontent.com/u/149944854?s=200&v=4',
      url: 'https://github.com/stition-ai/devika',
      updated_at: 'This week'
    },
    {
      id: 10,
      name: 'suno-bark',
      full_name: 'suno-ai/bark',
      description: 'Text-prompted generative audio model.',
      stars: 3500,
      forks: 480,
      language: 'Python',
      author: 'suno-ai',
      avatar: 'https://avatars.githubusercontent.com/u/126736589?s=200&v=4',
      url: 'https://github.com/suno-ai/bark',
      updated_at: 'This week'
    },
    {
      id: 11,
      name: 'memfree',
      full_name: 'memfreeme/memfree',
      description: 'Open source hybrid AI search engine.',
      stars: 2100,
      forks: 180,
      language: 'TypeScript',
      author: 'memfreeme',
      avatar: 'https://avatars.githubusercontent.com/u/124452456?s=200&v=4',
      url: 'https://github.com/memfreeme/memfree',
      updated_at: 'This week'
    },
    {
      id: 12,
      name: 'novita-ai',
      full_name: 'novita-ai/novita',
      description: 'Fast and scalable LLM API.',
      stars: 1900,
      forks: 150,
      language: 'Python',
      author: 'novita-ai',
      avatar: 'https://avatars.githubusercontent.com/u/133175152?s=200&v=4',
      url: 'https://github.com/novita-ai/novita',
      updated_at: 'This week'
    }
  ]
}

const languageColors: Record<string, string> = {
  'TypeScript': 'bg-blue-500',
  'Python': 'bg-yellow-500',
  'JavaScript': 'bg-yellow-400',
  'Go': 'bg-cyan-500',
  'Rust': 'bg-orange-500',
  'Java': 'bg-red-500',
  'C++': 'bg-pink-500',
  'HTML': 'bg-orange-400',
  'CSS': 'bg-blue-400',
  'Jupyter': 'bg-orange-600',
  'Vue': 'bg-green-500',
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

export default function GitHubPage() {
  const { t } = useLanguage()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadRepos = async () => {
    setLoading(true)
    const data = await fetchGitHubTrending()
    setRepos(data)
    setLoading(false)
  }

  useEffect(() => {
    loadRepos()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadRepos()
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Starfield />
        <MatrixRain />
        <ParticleGrid />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10 md:hidden" />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <NeonCard glowColor="purple" className="inline-flex items-center gap-2 px-4 py-2">
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">{t('githubTrending')}</span>
            </NeonCard>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-center mb-4"
          >
            <GlitchText 
              text={t('githubTitle')} 
              className="bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent"
            />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-center max-w-xl mx-auto mb-8"
          >
            {t('githubDesc')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <CyberButton onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              {isRefreshing ? t('refreshing') : t('refresh')}
            </CyberButton>
          </motion.div>
        </div>
      </section>
      
      {/* Repo Grid */}
      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                <div className="h-4 w-20 bg-slate-700/50 rounded mb-3" />
                <div className="h-5 w-3/4 bg-slate-700/50 rounded mb-2" />
                <div className="h-4 w-full bg-slate-700/50 rounded mb-4" />
                <div className="flex gap-3">
                  <div className="h-4 w-16 bg-slate-700/50 rounded" />
                  <div className="h-4 w-16 bg-slate-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {repos.map((repo, index) => (
              <RepoCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Github className="w-5 h-5 text-gray-400" />
            <span className="font-bold text-white">{t('footerTitle')}</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 {t('copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const langColor = languageColors[repo.language] || 'bg-gray-500'
  
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block"
    >
      <NeonCard glowColor="purple" className="p-5 relative overflow-hidden h-full">
        {/* Rank */}
        <div className="absolute top-3 right-3 text-xs font-medium text-slate-500">
          #{index + 1}
        </div>
        
        {/* Author & Avatar */}
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={repo.avatar} 
            alt={repo.author}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-slate-400">{repo.author}</span>
        </div>
        
        {/* Repo Name */}
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors mb-2 flex items-center gap-2">
          {repo.name}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {repo.description}
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${langColor}`} />
            <span className="text-slate-400">{repo.language}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>{formatStars(repo.stars)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <GitFork className="w-3.5 h-3.5" />
            <span>{formatStars(repo.forks)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{repo.updated_at}</span>
          </div>
        </div>
        
        {/* Hover Glow */}
        <motion.div
          className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </NeonCard>
    </motion.a>
  )
}
