'use client'

import { useState, useEffect, Suspense, memo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Cpu, Zap, TrendingUp, ArrowUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { GlitchText, CyberButton, NeonCard, DataCounter } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

// Dynamic imports for heavy visual effect components (bundle-dynamic-imports rule)
const Starfield = dynamic(() => import('@/components/effects/Starfield'), { ssr: false })
const MatrixRain = dynamic(() => import('@/components/effects/MatrixRain'), { ssr: false })
const ParticleGrid = dynamic(() => import('@/components/effects/ParticleGrid'), { ssr: false })
const NewsList = dynamic(() => import('@/components/NewsList'), { ssr: false })

export default function Home() {
  const { t } = useLanguage()
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Starfield />
        <MatrixRain />
        <ParticleGrid />
      </div>
      
      {/* Mobile gradient background fallback */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10 md:hidden" />
      
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '60s' }} />
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {/* Badge */}
          <NeonCard glowColor="purple" className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs md:text-sm font-medium">{t('heroBadge')}</span>
          </NeonCard>
          
          {/* Main Title with Glitch Effect */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <GlitchText text={t('heroTitle')} className="text-white" />
            <br />
            <GlitchText 
              text={t('heroSubtitle')} 
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" 
            />
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm md:text-lg text-slate-400 max-w-xl mx-auto mb-8 md:mb-10 px-4">
            {t('heroDesc')}
          </p>
          
          {/* CTA Button */}
          <CyberButton className="text-sm md:text-lg px-6 py-2.5 md:px-8 md:py-4">
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            {t('exploreNews')}
          </CyberButton>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-10 md:mt-16 px-4">
            <DataCounter 
              value="50+" 
              label={t('dailyNews')} 
              icon={<Cpu className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />} 
            />
            <DataCounter 
              value="10+" 
              label={t('sources')} 
              icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />} 
            />
            <DataCounter 
              value={t('updated').split('/')[0]} 
              label={t('updated').split('/')[1] || ''} 
              icon={<Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />} 
            />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-3 md:px-4 py-6 md:py-8 max-w-5xl relative z-10">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsList />
        </Suspense>
      </main>
      
      {/* Back to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 group"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop}
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
      <footer className="border-t border-slate-800 py-8 md:py-12 mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <NeonCard glowColor="indigo" className="p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
              <span className="text-lg md:text-xl font-bold text-white">{t('footerTitle')}</span>
            </div>
            <p className="text-slate-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
              {t('footerDesc')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {t('builtWith')}
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-600" />
              <span>{t('deployedOn')}</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-600" />
              <span>{t('dataSource')}</span>
            </div>
          </NeonCard>
          <p className="text-center text-xs text-slate-600 mt-6 px-4">
            © 2026 {t('copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}

const NewsSkeleton = memo(function NewsSkeleton() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Categories Skeleton */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="h-9 md:h-11 w-20 md:w-24 bg-slate-800/50 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      
      {/* Cards Skeleton */}
      <div className="grid gap-3 md:gap-4">
        {[...Array(4)].map((_, i) => (
          <NeonCard key={i} glowColor="indigo" className="animate-pulse p-4 md:p-6">
            <div className="flex gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-700/50 rounded-xl" />
              <div className="flex-1 space-y-2 md:space-y-3">
                <div className="h-2.5 md:h-3 w-20 md:w-24 bg-slate-700/50 rounded" />
                <div className="h-5 md:h-6 w-3/4 bg-slate-700/50 rounded" />
                <div className="h-3 md:h-4 w-full bg-slate-700/50 rounded" />
              </div>
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  )
})
