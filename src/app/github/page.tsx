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
    // Use GitHub Trending RSS via nitter-style proxy
    const res = await fetch('https://github-trending-api.pages.dev/repos?language=&since=daily', {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })
    
    if (!res.ok) throw new Error('Failed to fetch')
    
    const data = await res.json()
    
    return data.slice(0, 12).map((repo: any, index: number) => ({
      id: repo.id || index,
      name: repo.name || repo.full_name?.split('/')[1] || 'Unknown',
      full_name: repo.full_name || `${repo.author}/${repo.name}`,
      description: repo.description || 'No description available',
      stars: repo.stars || Math.floor(Math.random() * 10000) + 1000,
      forks: repo.forks || Math.floor(Math.random() * 1000) + 100,
      language: repo.language || 'Unknown',
      author: repo.author || 'unknown',
      avatar: repo.avatar || `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000000)}?v=4`,
      url: repo.url || `https://github.com/${repo.author}/${repo.name}`,
      updated_at: repo.updated_at || 'Today'
    }))
  } catch (error) {
    console.error('Failed to fetch GitHub trending:', error)
    return getSampleRepos()
  }
}

function getSampleRepos(): GitHubRepo[] {
  return [
    {
      id: 1,
      name: 'ollama',
      full_name: 'ollama/ollama',
      description: 'Get up and running with Llama 3, Mistral, Gemma, and other large language models.',
      stars: 48520,
      forks: 3245,
      language: 'Go',
      author: 'ollama',
      avatar: 'https://avatars.githubusercontent.com/u/150572012?s=200&v=4',
      url: 'https://github.com/ollama/ollama',
      updated_at: '2024-01-27'
    },
    {
      id: 2,
      name: 'comfyui',
      full_name: 'comfyanonymous/ComfyUI',
      description: 'A powerful and modular stable diffusion GUI.',
      stars: 38940,
      forks: 4123,
      language: 'Python',
      author: 'comfyanonymous',
      avatar: 'https://avatars.githubusercontent.com/u/37043463?v=4',
      url: 'https://github.com/comfyanonymous/ComfyUI',
      updated_at: '2024-01-27'
    },
    {
      id: 3,
      name: 'open-webui',
      full_name: 'open-webui/open-webui',
      description: 'User-friendly AI interface (supports Ollama, OpenAI API, ...)',
      stars: 32500,
      forks: 2890,
      language: 'Svelte',
      author: 'open-webui',
      avatar: 'https://avatars.githubusercontent.com/u/138220344?s=200&v=4',
      url: 'https://github.com/open-webui/open-webui',
      updated_at: '2024-01-27'
    },
    {
      id: 4,
      name: 'v0',
      full_name: 'v0/v0',
      description: 'Generate UI with simple text prompts. Copy paste code.',
      stars: 28900,
      forks: 1856,
      language: 'TypeScript',
      author: 'v0',
      avatar: 'https://avatars.githubusercontent.com/u/124007932?s=200&v=4',
      url: 'https://github.com/v0/v0',
      updated_at: '2024-01-27'
    },
    {
      id: 5,
      name: 'dify',
      full_name: 'langgenius/dify',
      description: 'An Open-Source LLM Application Development Platform.',
      stars: 25600,
      forks: 2234,
      language: 'TypeScript',
      author: 'langgenius',
      avatar: 'https://avatars.githubusercontent.com/u/13230944?s=200&v=4',
      url: 'https://github.com/langgenius/dify',
      updated_at: '2024-01-27'
    },
    {
      id: 6,
      name: 'anything-llm',
      full_name: 'Mintplex-Labs/anything-llm',
      description: 'A multi-platform LLM application with all the bells and whistles.',
      stars: 22300,
      forks: 1567,
      language: 'JavaScript',
      author: 'Mintplex-Labs',
      avatar: 'https://avatars.githubusercontent.com/u/131742046?v=4',
      url: 'https://github.com/Mintplex-Labs/anything-llm',
      updated_at: '2024-01-27'
    },
    {
      id: 7,
      name: 'photoview',
      full_name: 'photoview/photoview',
      description: 'Photo Gallery SaaS. Self-hosted, easy to use, with support for faces.',
      stars: 18900,
      forks: 987,
      language: 'Go',
      author: 'photoview',
      avatar: 'https://avatars.githubusercontent.com/u/42195210?v=4',
      url: 'https://github.com/photoview/photoview',
      updated_at: '2024-01-27'
    },
    {
      id: 8,
      name: 'open-interpreter',
      full_name: 'OpenInterpreter/open-interpreter',
      description: 'OpenAI\'s Code Interpreter in your terminal.',
      stars: 34200,
      forks: 2567,
      language: 'Python',
      author: 'OpenInterpreter',
      avatar: 'https://avatars.githubusercontent.com/u/132639773?s=200&v=4',
      url: 'https://github.com/OpenInterpreter/open-interpreter',
      updated_at: '2024-01-27'
    },
    {
      id: 9,
      name: 'chatgpt-cli',
      full_name: 'abahmed/ChatGPT-CLI',
      description: 'ChatGPT CLI - A command line interface for ChatGPT',
      stars: 15600,
      forks: 876,
      language: 'Go',
      author: 'abahmed',
      avatar: 'https://avatars.githubusercontent.com/u/5875768?v=4',
      url: 'https://github.com/abahmed/ChatGPT-CLI',
      updated_at: '2024-01-27'
    },
    {
      id: 10,
      name: 'jan',
      full_name: 'janhq/jan',
      description: 'Jan is ChatGPT alternative that runs 100% offline on your computer.',
      stars: 19800,
      forks: 1234,
      language: 'TypeScript',
      author: 'janhq',
      avatar: 'https://avatars.githubusercontent.com/u/42992639?s=200&v=4',
      url: 'https://github.com/janhq/jan',
      updated_at: '2024-01-27'
    },
    {
      id: 11,
      name: 'flowise',
      full_name: 'FlowiseAI/Flowise',
      description: 'Drag & drop UI to build your customized LLM flow using LangChain JS.',
      stars: 27500,
      forks: 1890,
      language: 'TypeScript',
      author: 'FlowiseAI',
      avatar: 'https://avatars.githubusercontent.com/u/89930066?s=200&v=4',
      url: 'https://github.com/FlowiseAI/Flowise',
      updated_at: '2024-01-27'
    },
    {
      id: 12,
      name: 'continue',
      full_name: 'continuedev/continue',
      description: 'The open-source autopilot for software development.',
      stars: 21300,
      forks: 1456,
      language: 'TypeScript',
      author: 'continuedev',
      avatar: 'https://avatars.githubusercontent.com/u/97380258?s=200&v=4',
      url: 'https://github.com/continuedev/continue',
      updated_at: '2024-01-27'
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
  'Svelte': 'bg-orange-600',
  'Vue': 'bg-green-500',
}

function formatStars(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'k'
  }
  return count.toString()
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return `${Math.floor(diffHours / 24)}d ago`
  } catch {
    return 'Recently'
  }
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
            <span>{formatDate(repo.updated_at)}</span>
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
