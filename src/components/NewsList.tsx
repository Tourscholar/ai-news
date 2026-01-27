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
  Clock,
  Sparkles
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
  { id: 'all', label: 'All', icon: Globe, color: 'from-gray-500 to-gray-600' },
  { id: 'industry', label: 'Industry', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { id: 'application', label: 'AI Apps', icon: Cpu, color: 'from-purple-500 to-pink-500' },
  { id: 'policy', label: 'Policy & Safety', icon: Shield, color: 'from-red-500 to-orange-500' },
  { id: 'other', label: 'Other', icon: Lightbulb, color: 'from-amber-500 to-yellow-500' },
]

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      setNews(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-secondary/50 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-secondary/50 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-24 bg-secondary/50 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 w-full bg-secondary/50 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "relative group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                "hover-scale hover-lift",
                isActive 
                  ? "text-white" 
                  : "glass-card text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-r opacity-100 transition-opacity",
                  cat.color
                )} />
              )}
              <Icon className={cn(
                "w-4 h-4 relative z-10",
                isActive ? "text-white" : ""
              )} />
              <span className="relative z-10">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Last Updated & Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated: {format(lastUpdated, 'HH:mm')}</span>
          </div>
        </div>
        <button
          onClick={fetchNews}
          disabled={isRefreshing}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            bg-secondary/50 hover:bg-secondary transition-all duration-300
            disabled:opacity-50 hover-scale"
        >
          <RefreshCw className={cn(
            "w-4 h-4 transition-transform duration-500",
            isRefreshing && "animate-spin"
          )} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* News List */}
      <div className="grid gap-4 animate-stagger">
        {filteredNews.map((item, index) => {
          const category = categories.find(c => c.id === item.category) || categories[4]
          const Icon = category.icon
          const colorClass = category.color
          
          return (
            <article
              key={item.id}
              className="group glass-card rounded-2xl p-5 hover-lift hover-glow cursor-pointer card-premium"
              onClick={() => window.open(item.url, '_blank')}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    colorClass
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Sparkle effect on hover */}
                  <div className="absolute -top-1 -right-1 w-4 h-4">
                    <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full",
                      "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
                      "text-indigo-600 dark:text-indigo-400",
                      "border border-indigo-500/20"
                    )}>
                      {item.source}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      {item.timestamp}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-lg font-semibold leading-snug 
                    text-foreground group-hover:text-primary 
                    transition-colors duration-300">
                    <span className="flex items-center gap-2">
                      {item.title}
                      <ExternalLink className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground" />
                    </span>
                  </h2>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  "bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity",
                  colorClass,
                  "text-white"
                )}>
                  {category.label}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No news found</h3>
          <p className="text-muted-foreground">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}
