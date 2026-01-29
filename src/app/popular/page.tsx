'use client'

import { useState, useEffect, memo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  TrendingUp,
  Sparkles,
  Zap,
  Flame,
  ArrowUp,
  RefreshCw
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { GlitchText, CyberButton } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

// Dynamic imports for heavy visual effect components (bundle-dynamic-imports rule)
const Starfield = dynamic(() => import('@/components/effects/Starfield'), { ssr: false })
const MatrixRain = dynamic(() => import('@/components/effects/MatrixRain'), { ssr: false })
const ParticleGrid = dynamic(() => import('@/components/effects/ParticleGrid'), { ssr: false })

interface PopularItem {
  id: string
  title: string
  source: string
  category: string
  views: string
  timestamp: string
  url: string
}

const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  Industry: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  Policy: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  Apps: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  Tech: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
}

export default function PopularPage() {
  const { t } = useLanguage()
  const [items, setItems] = useState<PopularItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [columnCount, setColumnCount] = useState(1)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
    }
    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)
    return () => window.removeEventListener('resize', updateColumnCount)
  }, [])
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)

    // 键盘快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Home' || (e.key === 'g' && e.ctrlKey)) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const fetchPopular = async () => {
    try {
      const res = await fetch('/api/popular?t=' + Date.now(), {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch popular news:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPopular()
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchPopular()
    setIsRefreshing(false)
  }

  const columns: PopularItem[][] = Array.from({ length: columnCount }, () => [])
  
  items.forEach((item, index) => {
    columns[index % columnCount].push(item)
  })

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50" style={{ scaleX, transformOrigin: '0%' }} />
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Starfield />
        <MatrixRain />
        <ParticleGrid />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10 md:hidden" />
      
      <Header />
      
      {/* Hero */}
      <section className="relative py-12 md:py-16 overflow-hidden z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-400">{t('trendingNow')}</span>
            </div>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t('popularTitle')}
            </span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 text-center max-w-xl mx-auto mb-8">
            {t('popularDesc')}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center">
            <CyberButton onClick={refreshData} disabled={isRefreshing} className="flex items-center gap-2">
              <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}>
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              {isRefreshing ? t('refreshing') : t('refresh')}
            </CyberButton>
          </motion.div>
        </div>
      </section>
      
      {/* Cards Grid */}
      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800/60 h-[160px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <PopularCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </main>
      
      {/* Back to Top */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 group"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ pointerEvents: showBackToTop ? 'auto' : 'none' }}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
          {/* Button */}
          <div className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40">
            <ArrowUp className="w-5 h-5" />
            <span className="text-sm font-medium pr-1">TOP</span>
          </div>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          按 G 键或 Home 键
        </div>
      </motion.button>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">{t('footerTitle')}</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 {t('copyright')}</p>
        </div>
      </footer>
    </div>
  )
}

const PopularCard = memo(function PopularCard({ item, index }: { item: PopularItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const style = categoryStyles[item.category] || categoryStyles.Industry

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block h-[160px]"
    >
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-800/60 hover:border-slate-700 transition-all duration-300 overflow-hidden h-full">
        
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Left accent bar */}
        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b ${style.text.replace('text-', 'from-').replace('400', '500')} ${style.text.replace('text-', 'to-').replace('400', '400')} transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
        
        {/* Rank number */}
        <div className={`absolute top-4 right-4 text-2xl font-bold ${style.text} opacity-20 group-hover:opacity-40 transition-opacity`}>
          {String(index + 1).padStart(2, '0')}
        </div>
        
        {/* Category */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text} border ${style.border} mb-3`}>
          <TrendingUp className="w-3 h-3" />
          {item.category}
        </div>
        
        {/* Title */}
        <h2 className="text-base font-semibold text-slate-200 group-hover:text-white leading-snug mb-4 pr-8 line-clamp-2">
          {item.title}
        </h2>
        
        {/* Meta info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="truncate max-w-[60px]">{item.source}</span>
            <span className="text-slate-700">·</span>
            <span>{item.timestamp}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-sm font-medium text-amber-400">{item.views}</span>
          </div>
        </div>
      </div>
    </motion.a>
  )
})
