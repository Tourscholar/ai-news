'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
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
import { useLanguage } from '@/locales/LanguageContext'

interface NewsItem {
  id: string
  title: string
  source: string
  category: string
  timestamp: string
  url: string
}

const categories = [
  { id: 'all', key: 'all', icon: Globe, color: 'from-gray-500 to-gray-600' },
  { id: 'industry', key: 'industry', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { id: 'application', key: 'aiApps', icon: Cpu, color: 'from-purple-500 to-pink-500' },
  { id: 'policy', key: 'policy', icon: Shield, color: 'from-red-500 to-orange-500' },
  { id: 'other', key: 'other', icon: Lightbulb, color: 'from-amber-500 to-yellow-500' },
]

export default function NewsList() {
  const { t } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchNews = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/news?t=' + Date.now())
      const data = await res.json()
      setNews(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(fetchNews, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchNews])

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-24 bg-slate-800/50 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-slate-800/50 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "relative group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300",
                "hover:scale-105",
                isActive 
                  ? "text-white" 
                  : "glass-card text-slate-400 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-r opacity-100",
                    cat.color
                  )}
                  layoutId="activeCategory"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn(
                "w-3.5 h-3.5 md:w-4 md:h-4 relative z-10",
                isActive ? "text-white" : ""
              )} />
              <span className="relative z-10">{t(cat.key)}</span>
            </button>
          )
        })}
      </div>

      {/* Last Updated & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>{t('lastUpdated')}: {lastUpdated.toLocaleTimeString()}</span>
          <span className="hidden sm:inline text-slate-500">· {t('autoRefresh')}</span>
        </div>
        
        <motion.button
          onClick={fetchNews}
          disabled={isRefreshing}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium",
            "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-all duration-300",
            "disabled:opacity-50"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </motion.div>
          <span>{isRefreshing ? t('refreshing') : t('refresh')}</span>
        </motion.button>
      </div>

      {/* News Count */}
      <div className="text-xs md:text-sm text-slate-500">
        {`显示 ${filteredNews.length} 条，共 ${news.length} 篇`}
      </div>

      {/* News List */}
      <div className="grid gap-3 md:gap-4">
        {filteredNews.map((item, index) => {
          const category = categories.find(c => c.id === item.category) || categories[4]
          const Icon = category.icon
          const colorClass = category.color
          
          return (
            <motion.article
              key={item.id}
              className="group glass-card rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer hover:border-slate-600/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
              onClick={() => window.open(item.url, '_blank')}
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Category Icon */}
                <motion.div 
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    colorClass
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
                      "text-indigo-400 border border-indigo-500/20"
                    )}>
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-500">{item.timestamp}</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-sm md:text-lg font-semibold leading-snug text-slate-200 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-2">
                      {item.title}
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-500 shrink-0" />
                    </span>
                  </h2>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4">
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  "bg-gradient-to-r opacity-70 group-hover:opacity-100 transition-opacity",
                  colorClass,
                  "text-white"
                )}>
                  {t(category.key)}
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
          <Lightbulb className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold mb-2 text-slate-400">{t('noNews')}</h3>
        </div>
      )}
    </div>
  )
}
