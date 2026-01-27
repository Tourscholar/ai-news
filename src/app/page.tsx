import NewsList from '@/components/NewsList'
import Header from '@/components/Header'
import { Suspense } from 'react'
import { Sparkles } from 'lucide-react'

export const revalidate = 3600 // 每小时重新验证

export default function Home() {
  return (
    <div className="min-h-screen aurora-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">AI News Daily</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Stay Ahead with{' '}
            <span className="text-gradient">Artificial Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Curated daily AI news, insights, and trends from the world's leading sources.
          </p>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsList />
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8 mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">AI News Daily</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your daily dose of AI news and insights. Updated hourly.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Built with Next.js</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>Deployed on Vercel</span>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            © 2026 AI News Daily. All rights reserved.
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
          <div key={i} className="h-10 w-24 bg-secondary/50 rounded-full animate-pulse" />
        ))}
      </div>
      
      {/* Cards Skeleton */}
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
