import NewsList from '@/components/NewsList'
import Header from '@/components/Header'
import { Suspense } from 'react'

export const revalidate = 3600 // 每小时重新验证

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsList />
        </Suspense>
      </main>
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          AI News Daily · Updated hourly
        </div>
      </footer>
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-card rounded-xl p-6 shadow-sm">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
