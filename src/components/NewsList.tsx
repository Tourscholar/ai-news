'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  TrendingUp, 
  Cpu, 
  Shield, 
  Lightbulb, 
  Globe, 
  RefreshCw,
  ExternalLink,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsItem {
  id: string
  title: string
  source: string
  category: string
  timestamp: string
  url: string
}

const categories = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'industry', label: 'Industry', icon: TrendingUp },
  { id: 'application', label: 'AI Apps', icon: Cpu },
  { id: 'policy', label: 'Policy & Safety', icon: Shield },
  { id: 'other', label: 'Other', icon: Lightbulb },
]

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      setNews(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : Lightbulb
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      industry: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      application: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      policy: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    }
    return colors[category] || colors.other
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-card rounded-xl p-6 shadow-sm border">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Last updated: {format(lastUpdated, 'HH:mm')}</span>
        <button
          onClick={fetchNews}
          className="flex items-center gap-1 text-primary hover:underline ml-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* News List */}
      <div className="grid gap-4">
        {filteredNews.map((item, index) => {
          const Icon = getCategoryIcon(item.category)
          return (
            <article
              key={item.id}
              className="group bg-card rounded-xl p-6 shadow-sm border hover:shadow-md transition-all animate-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-2 rounded-lg shrink-0',
                  getCategoryColor(item.category)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {item.source}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {item.timestamp}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      {item.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </h2>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No news found in this category
        </div>
      )}
    </div>
  )
}
