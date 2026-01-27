import NewsList from '@/components/NewsList'
import Header from '@/components/Header'
import { Suspense } from 'react'
import { Sparkles, Cpu, Zap, TrendingUp } from 'lucide-react'
import Starfield from '@/components/effects/Starfield'
import MatrixRain from '@/components/effects/MatrixRain'
import ParticleGrid from '@/components/effects/ParticleGrid'
import { GlitchText, CyberButton, NeonCard, DataCounter } from '@/components/effects/CyberComponents'

export const revalidate = 3600

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <Starfield />
      <MatrixRain />
      <ParticleGrid />
      
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '60s' }} />
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {/* Badge */}
          <NeonCard glowColor="purple" className="inline-flex items-center gap-2 px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Live AI News Feed</span>
          </NeonCard>
          
          {/* Main Title with Glitch Effect */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <GlitchText text="Stay Ahead with" className="text-white" />
            <br />
            <GlitchText 
              text="Artificial Intelligence" 
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" 
            />
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Curated real-time AI news from Google News RSS feed. 
            Powered by Next.js + Vercel with modern cyber aesthetics.
          </p>
          
          {/* CTA Button */}
          <CyberButton className="text-lg px-8 py-4">
            <Zap className="w-5 h-5" />
            Explore Latest News
          </CyberButton>
          
          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16">
            <DataCounter 
              value="50+" 
              label="Daily News" 
              icon={<Cpu className="w-5 h-5 text-indigo-400" />} 
            />
            <DataCounter 
              value="10+" 
              label="Sources" 
              icon={<TrendingUp className="w-5 h-5 text-purple-400" />} 
            />
            <DataCounter 
              value="24/7" 
              label="Updated" 
              icon={<Sparkles className="w-5 h-5 text-pink-400" />} 
            />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsList />
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <NeonCard glowColor="indigo" className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">AI News Daily</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Your daily dose of AI news and insights. Stay informed with the latest 
              developments in artificial intelligence. Updated in real-time.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Built with Next.js
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Deployed on Vercel</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Google News RSS</span>
            </div>
          </NeonCard>
          <p className="text-center text-xs text-slate-600 mt-6">
            © 2026 AI News Daily. All rights reserved. Powered by modern tech stack.
          </p>
        </div>
      </footer>
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Categories Skeleton */}
      <div className="flex flex-wrap gap-3">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="h-11 w-24 bg-slate-800/50 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      
      {/* Cards Skeleton */}
      <div className="grid gap-4">
        {[...Array(6)].map((_, i) => (
          <NeonCard key={i} glowColor="indigo" className="animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-3 w-24 bg-slate-700/50 rounded" />
                <div className="h-6 w-3/4 bg-slate-700/50 rounded" />
                <div className="h-4 w-full bg-slate-700/50 rounded" />
              </div>
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  )
}
