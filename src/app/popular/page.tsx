'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Flame,
  ArrowUp,
  RefreshCw,
  Clock
} from 'lucide-react'
import Header from '@/components/Header'
import Starfield from '@/components/effects/Starfield'
import MatrixRain from '@/components/effects/MatrixRain'
import ParticleGrid from '@/components/effects/ParticleGrid'
import { GlitchText, NeonCard, CyberButton } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

interface PopularItem {
  id: string
  title: string
  source: string
  category: string
  views: string
  timestamp: string
  url: string
  image?: string
}

// Simulated popular data (in production, this would come from analytics)
const generatePopularItems = (): PopularItem[] => [
  {
    id: '1',
    title: 'OpenAI GPT-5 Rumors: What We Know About the Next Generation',
    source: 'The Verge',
    category: 'industry',
    views: '2.3M',
    timestamp: '2h ago',
    url: '#',
  },
  {
    id: '2',
    title: 'EU Parliament Passes Comprehensive AI Act: Key Points',
    source: 'TechCrunch',
    category: 'policy',
    views: '1.8M',
    timestamp: '4h ago',
    url: '#',
  },
  {
    id: '3',
    title: 'NVIDIA CEO Reveals Roadmap for Next-Gen AI Chips',
    source: 'Reuters',
    category: 'industry',
    views: '1.5M',
    timestamp: '6h ago',
    url: '#',
  },
  {
    id: '4',
    title: 'Midjourney V7: Stunning New Features and Capabilities',
    source: 'Wired',
    category: 'application',
    views: '1.2M',
    timestamp: '8h ago',
    url: '#',
  },
  {
    id: '5',
    title: 'Google DeepMind AlphaFold 3: Revolutionizing Drug Discovery',
    source: 'MIT Tech Review',
    category: 'industry',
    views: '980K',
    timestamp: '10h ago',
    url: '#',
  },
  {
    id: '6',
    title: 'Anthropic Claude 3.5 vs GPT-4: Ultimate Comparison',
    source: 'Ars Technica',
    category: 'application',
    views: '876K',
    timestamp: '12h ago',
    url: '#',
  },
  {
    id: '7',
    title: 'China\'s New AI Regulations: What Companies Need to Know',
    source: 'Bloomberg',
    category: 'policy',
    views: '754K',
    timestamp: 'Yesterday',
    url: '#',
  },
  {
    id: '8',
    title: 'Apple Silicon M4 Chip: AI Performance Leap',
    source: 'The Verge',
    category: 'industry',
    views: '689K',
    timestamp: 'Yesterday',
    url: '#',
  },
  {
    id: '9',
    title: 'Runway Gen-3 Alpha: Text-to-Video Revolution',
    source: 'TechCrunch',
    category: 'application',
    views: '612K',
    timestamp: '2d ago',
    url: '#',
  },
  {
    id: '10',
    title: 'Meta LLaMA 4 Leaks: Performance Benchmarks',
    source: 'Wired',
    category: 'industry',
    views: '567K',
    timestamp: '2d ago',
    url: '#',
  },
  {
    id: '11',
    title: 'Tesla Optimus: New Demo Shows Humanoid Progress',
    source: 'Reuters',
    category: 'industry',
    views: '523K',
    timestamp: '2d ago',
    url: '#',
  },
  {
    id: '12',
    title: 'AI in Healthcare: FDA Approvals Hit Record High',
    source: 'MIT News',
    category: 'application',
    views: '498K',
    timestamp: '3d ago',
    url: '#',
  },
]

const categoryColors: Record<string, string> = {
  industry: 'from-blue-500 to-cyan-500',
  application: 'from-purple-500 to-pink-500',
  policy: 'from-red-500 to-orange-500',
  other: 'from-amber-500 to-yellow-500',
}

export default function PopularPage() {
  const { t } = useLanguage()
  const [items] = useState<PopularItem[]>(generatePopularItems)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [columnCount, setColumnCount] = useState(1)
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
  
  const refreshData = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }, [])

  // Masonry layout - distribute items into columns
  const columns: PopularItem[][] = Array.from({ length: columnCount }, () => [])
  
  // Scroll state for back to top button
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  items.forEach((item, index) => {
    columns[index % columnCount].push(item)
  })

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Starfield />
        <MatrixRain />
        <ParticleGrid />
      </div>
      
      {/* Mobile gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10 md:hidden" />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <NeonCard glowColor="pink" className="inline-flex items-center gap-2 px-4 py-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{t('trendingNow')}</span>
            </NeonCard>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-center mb-4"
          >
            <GlitchText 
              text={t('popularTitle')} 
              className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            />
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-center max-w-xl mx-auto mb-8"
          >
            {t('popularDesc')}
          </motion.p>
          
          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <CyberButton
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
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
      
      {/* Masonry Grid */}
      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4 md:gap-6">
              {column.map((item, itemIndex) => (
                <PopularCard
                  key={item.id}
                  item={item}
                  index={itemIndex}
                  colorClass={categoryColors[item.category] || categoryColors.other}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
      
      {/* Back to Top - Fixed position button */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0,
          y: showBackToTop ? 0 : 20
        }}
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
          <p className="text-slate-500 text-sm">
            © 2026 {t('copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}

function PopularCard({ item, index, colorClass }: { item: PopularItem; index: number; colorClass: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(item.url, '_blank')}
      className="group cursor-pointer h-full"
    >
      <NeonCard 
        glowColor={item.category as any} 
        className="p-5 relative overflow-hidden h-full flex flex-col"
      >
        {/* Rank Badge */}
        <motion.div
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm shrink-0`}
          animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          #{index + 1}
        </motion.div>
        
        {/* Category Badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colorClass} text-white mb-3 shrink-0`}>
          <TrendingUp className="w-3 h-3" />
          {item.category}
        </div>
        
        {/* Title - Fixed height with truncation */}
        <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white leading-snug mb-3 pr-10 h-[4.5rem] overflow-hidden">
          {item.title}
        </h2>
        
        {/* Meta - Push to bottom */}
        <div className="mt-auto pt-3 border-t border-slate-700/50">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="truncate max-w-[80px]">{item.source}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {item.timestamp}
            </span>
          </div>
          
          {/* Views */}
          <div className="flex items-center gap-2 mt-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-sm font-medium text-amber-400">{item.views}</span>
            <span className="text-xs text-slate-500">{t('views')}</span>
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity`}
        />
      </NeonCard>
    </motion.article>
  )
}
