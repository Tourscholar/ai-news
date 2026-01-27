'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Flame,
  ArrowUp,
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react'
import Header from '@/components/Header'
import Starfield from '@/components/effects/Starfield'
import MatrixRain from '@/components/effects/MatrixRain'
import ParticleGrid from '@/components/effects/ParticleGrid'
import { GlitchText, CyberButton } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

interface PopularItem {
  id: string
  title: string
  source: string
  category: string
  views: string
  timestamp: string
  url: string
}

const generatePopularItems = (): PopularItem[] => [
  { id: '1', title: 'OpenAI GPT-5 Rumors: What We Know About the Next Generation', source: 'The Verge', category: 'Industry', views: '2.3M', timestamp: '2h', url: '#' },
  { id: '2', title: 'EU Parliament Passes Comprehensive AI Act: Key Points', source: 'TechCrunch', category: 'Policy', views: '1.8M', timestamp: '4h', url: '#' },
  { id: '3', title: 'NVIDIA CEO Reveals Roadmap for Next-Gen AI Chips', source: 'Reuters', category: 'Industry', views: '1.5M', timestamp: '6h', url: '#' },
  { id: '4', title: 'Midjourney V7: Stunning New Features and Capabilities', source: 'Wired', category: 'Apps', views: '1.2M', timestamp: '8h', url: '#' },
  { id: '5', title: 'Google DeepMind AlphaFold 3: Drug Discovery Revolution', source: 'MIT Tech', category: 'Industry', views: '980K', timestamp: '10h', url: '#' },
  { id: '6', title: 'Claude 3.5 vs GPT-4: The Ultimate Comparison', source: 'Ars Tech', category: 'Apps', views: '876K', timestamp: '12h', url: '#' },
  { id: '7', title: 'China\'s New AI Regulations: What Companies Need', source: 'Bloomberg', category: 'Policy', views: '754K', timestamp: 'Yesterday', url: '#' },
  { id: '8', title: 'Apple Silicon M4 Chip: AI Performance Breakthrough', source: 'The Verge', category: 'Industry', views: '689K', timestamp: 'Yesterday', url: '#' },
  { id: '9', title: 'Runway Gen-3 Alpha: Text-to-Video Revolution', source: 'TechCrunch', category: 'Apps', views: '612K', timestamp: '2d', url: '#' },
  { id: '10', title: 'Meta LLaMA 4 Leaks: Performance Benchmarks', source: 'Wired', category: 'Industry', views: '567K', timestamp: '2d', url: '#' },
  { id: '11', title: 'Tesla Optimus: New Demo Shows Humanoid Progress', source: 'Reuters', category: 'Industry', views: '523K', timestamp: '2d', url: '#' },
  { id: '12', title: 'AI in Healthcare: FDA Approvals Hit Record High', source: 'MIT News', category: 'Apps', views: '498K', timestamp: '3d', url: '#' },
]

const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  Industry: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  Policy: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  Apps: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
}

export default function PopularPage() {
  const { t } = useLanguage()
  const [items] = useState<PopularItem[]>(generatePopularItems)
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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {column.map((item, itemIndex) => (
                <PopularCard key={item.id} item={item} index={itemIndex} />
              ))}
            </div>
          ))}
        </div>
      </main>
      
      {/* Back to Top */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ pointerEvents: showBackToTop ? 'auto' : 'none' }}
      >
        <ArrowUp className="w-5 h-5" />
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

function PopularCard({ item, index }: { item: PopularItem; index: number }) {
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
      className="group block"
    >
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-800/60 hover:border-slate-700 transition-all duration-300 overflow-hidden">
        
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
}
