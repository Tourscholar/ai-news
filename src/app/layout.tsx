import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'
import { LanguageProvider } from '@/locales/LanguageContext'
import { locales, defaultLocale } from '@/locales'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'AI News Daily | 每日 AI 新闻资讯',
  description: '每日精选 AI 新闻、资讯与趋势。紧跟人工智能最新发展。',
  keywords: ['AI', 'Artificial Intelligence', 'News', 'Tech', 'Machine Learning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning className="scrollbar-premium">
      <body className={`${inter.className} antialiased min-h-screen`}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
