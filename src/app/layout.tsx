import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AI News Daily | Your Daily AI News Aggregator',
  description: 'Stay ahead with artificial intelligence news, insights, and trends from the world\'s leading sources. Updated hourly.',
  keywords: ['AI', 'Artificial Intelligence', 'News', 'Tech', 'Machine Learning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-premium">
      <body className={`${inter.className} antialiased min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
