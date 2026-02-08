'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, locales, defaultLocale } from './index'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

type TranslationFn = (key: string, params?: Record<string, string | number>) => string

const translations: Record<string, Record<string, string>> = {
  zh: {
    siteTitle: 'AI 新闻', siteSubtitle: '每日',
    navLatest: '最新', navPopular: '热门', navAbout: '关于',
    subscribe: '订阅', signIn: '登录', signOut: '退出',
    heroBadge: '实时 AI 新闻', heroTitle: '紧跟', heroSubtitle: '人工智能',
    heroDesc: '每日精选 AI 新闻、资讯与趋势，来自全球权威来源。每小时自动更新。',
    exploreNews: '探索新闻', dailyNews: '每日新闻', sources: '来源',
    updated: '实时更新', all: '全部', industry: '行业动态',
    aiApps: 'AI 应用', policy: '政策安全', other: '其他',
    lastUpdated: '最后更新', autoRefresh: '自动每 30 分钟',
    refresh: '刷新', refreshing: '刷新中...', noNews: '该分类暂无新闻',
    footerTitle: 'AI News Daily', footerDesc: '您的每日 AI 新闻资讯助手。紧跟人工智能最新发展，实时更新。',
    builtWith: '基于 Next.js 构建', deployedOn: '部署于 Vercel',
    dataSource: 'Google News RSS', copyright: '版权所有',
    signInTitle: '欢迎回来', signInDesc: '登录以获取个性化 AI 新闻推荐',
    continueWithGithub: '使用 GitHub 登录', or: '或',
    benefit1: '个性化新闻推荐', benefit2: '收藏和书签', benefit3: '实时通知',
    privacyNote: '登录即表示您同意我们的服务条款和隐私政策。',
    backHome: '返回首页',
    trendingNow: '🔥 正在热搜', popularTitle: '热门新闻', popularDesc: '探索最受关注的 AI 新闻和趋势',
    views: '次阅读',
    navGithub: 'GitHub 热榜', githubTrending: '🔥 今日热榜', githubTitle: 'GitHub Trending', githubDesc: '发现 GitHub 上最受欢迎的开源项目',
    navSubscribe: '订阅计划',
    
    // Subscribe Page
    choosePlan: '选择你的订阅计划',
    choosePlanEn: 'Choose Your Plan',
    subscribeDesc: '获取最新的 AI 新闻资讯，个性化推荐，让信息主动找到你',
    subscribeDescEn: 'Get the latest AI news and insights. Personalized recommendations that bring information to you.',
    
    // Pricing
    freePlan: '免费版',
    freePlanEn: 'Free',
    proPlan: '专业版',
    proPlanEn: 'Pro',
    teamPlan: '团队版',
    teamPlanEn: 'Team',
    popular: '最受欢迎',
    popularEn: 'Most Popular',
    selectPlan: '选择计划',
    selectPlanEn: 'Select Plan',
    selected: '已选择',
    selectedEn: 'Selected',
    
    // Features
    daily精选: '每日精选 10 篇',
    daily精选En: '10精选新闻/天',
    basicFilter: '基础分类筛选',
    basicFilterEn: '基础分类筛选',
    rss订阅: 'RSS 订阅',
    rss订阅En: 'RSS 订阅',
    
    // Pro Features
    unlimitedNews: '无限新闻订阅',
    unlimitedNewsEn: '无限新闻',
    ai摘要: 'AI 摘要生成',
    ai摘要En: 'AI 摘要',
    realtimePush: '实时推送通知',
    realtimePushEn: '实时推送',
    customKeywords: '自定义关键词',
    customKeywordsEn: '自定义关键词',
    
    // Team Features
    teamMembers: '多成员管理',
    teamMembersEn: '多成员',
    apiAccess: 'API 访问权限',
    apiAccessEn: 'API 权限',
    support: '专属技术支持',
    supportEn: '技术支持',
    export: '数据导出',
    exportEn: '数据导出',
    
    // Newsletter
    emailNewsletter: '邮件简报',
    emailNewsletterEn: 'Email Newsletter',
    weeklyDigest: '每周精选 AI 新闻，直接发送到你的邮箱',
    weeklyDigestEn: 'Weekly curated AI news, delivered directly to your inbox.',
    enterEmail: '输入你的邮箱地址',
    enterEmailEn: 'Enter your email address',
    
    // RSS
    rssSubscribe: '使用 RSS 阅读器订阅',
    rssSubscribeEn: 'Subscribe with your RSS reader',
    copy: '复制',
    copyEn: 'Copy',
    
    // Feature Cards
    realtimeUpdates: '实时更新',
    realtimeUpdatesEn: 'Real-time Updates',
    autoUpdates: '每小时自动更新',
    autoUpdatesEn: 'Auto-updates hourly',
    smartFiltering: '智能筛选',
    smartFilteringEn: 'Smart Filtering',
    aiPowered: 'AI 驱动的个性化推荐',
    aiPoweredEn: 'AI-powered recommendations',
    privacyFirst: '隐私优先',
    privacyFirstEn: 'Privacy First',
    noData: '不收集个人数据',
    noDataEn: 'No personal data collection',
  },
  en: {
    siteTitle: 'AI News', siteSubtitle: 'Daily',
    navLatest: 'Latest', navPopular: 'Popular', navAbout: 'About',
    subscribe: 'Subscribe', signIn: 'Sign In', signOut: 'Sign Out',
    heroBadge: 'Live AI News Feed', heroTitle: 'Stay Ahead with', 
    heroSubtitle: 'Artificial Intelligence',
    heroDesc: 'Curated real-time AI news, insights, and trends from the world\'s leading sources. Updated hourly.',
    exploreNews: 'Explore News', dailyNews: 'Daily News', sources: 'Sources',
    updated: '24/7 Updated', all: 'All', industry: 'Industry',
    aiApps: 'AI Apps', policy: 'Policy & Safety', other: 'Other',
    lastUpdated: 'Updated', autoRefresh: 'Auto every 30min',
    refresh: 'Refresh', refreshing: 'Refreshing...', noNews: 'No news found',
    footerTitle: 'AI News Daily', footerDesc: 'Your daily dose of AI news and insights. Stay informed with the latest.',
    builtWith: 'Built with Next.js', deployedOn: 'Deployed on Vercel',
    dataSource: 'Google News RSS', copyright: 'All rights reserved.',
    signInTitle: 'Welcome Back', signInDesc: 'Sign in to access your personalized AI news feed',
    continueWithGithub: 'Continue with GitHub', or: 'or',
    benefit1: 'Personalized recommendations', benefit2: 'Save and bookmark', benefit3: 'Real-time notifications',
    privacyNote: 'By signing in, you agree to our Terms of Service and Privacy Policy.',
    backHome: 'Back to Home',
    trendingNow: '🔥 Trending Now', popularTitle: 'Popular News', popularDesc: 'Explore the most talked about AI news and trends',
    views: 'views',
    navGithub: 'GitHub Trending', githubTrending: '🔥 Trending Today', githubTitle: 'GitHub Trending', githubDesc: 'Discover the most popular open source projects on GitHub',
    navSubscribe: 'Subscriptions',
    
    // Subscribe Page
    choosePlan: 'Choose Your Plan',
    choosePlanEn: 'Choose Your Plan',
    subscribeDesc: 'Get the latest AI news and insights. Personalized recommendations that bring information to you.',
    subscribeDescEn: 'Get the latest AI news and insights. Personalized recommendations that bring information to you.',
    
    // Pricing
    freePlan: 'Free',
    freePlanEn: 'Free',
    proPlan: 'Pro',
    proPlanEn: 'Pro',
    teamPlan: 'Team',
    teamPlanEn: 'Team',
    popular: 'Most Popular',
    popularEn: 'Most Popular',
    selectPlan: 'Select Plan',
    selectPlanEn: 'Select Plan',
    selected: 'Selected',
    selectedEn: 'Selected',
    
    // Features
    daily精选: '10精选新闻/天',
    daily精选En: '10精选新闻/天',
    basicFilter: 'Basic Category Filter',
    basicFilterEn: 'Basic Category Filter',
    rss订阅: 'RSS 订阅',
    rss订阅En: 'RSS Subscription',
    
    // Pro Features
    unlimitedNews: 'Unlimited News Subscription',
    unlimitedNewsEn: 'Unlimited News',
    ai摘要: 'AI Summary Generation',
    ai摘要En: 'AI Summary',
    realtimePush: 'Real-time Push Notifications',
    realtimePushEn: 'Real-time Push',
    customKeywords: 'Custom Keywords',
    customKeywordsEn: 'Custom Keywords',
    
    // Team Features
    teamMembers: 'Multi-member Management',
    teamMembersEn: 'Multi-member',
    apiAccess: 'API Access',
    apiAccessEn: 'API Access',
    support: 'Dedicated Support',
    supportEn: 'Support',
    export: 'Data Export',
    exportEn: 'Data Export',
    
    // Newsletter
    emailNewsletter: 'Email Newsletter',
    emailNewsletterEn: 'Email Newsletter',
    weeklyDigest: 'Weekly curated AI news, delivered directly to your inbox.',
    weeklyDigestEn: 'Weekly curated AI news, delivered directly to your inbox.',
    enterEmail: 'Enter your email address',
    enterEmailEn: 'Enter your email address',
    
    // RSS
    rssSubscribe: 'Subscribe with your RSS reader',
    rssSubscribeEn: 'Subscribe with your RSS reader',
    copy: 'Copy',
    copyEn: 'Copy',
    
    // Feature Cards
    realtimeUpdates: 'Real-time Updates',
    realtimeUpdatesEn: 'Real-time Updates',
    autoUpdates: 'Auto-updates hourly',
    autoUpdatesEn: 'Auto-updates hourly',
    smartFiltering: 'Smart Filtering',
    smartFilteringEn: 'Smart Filtering',
    aiPowered: 'AI-powered recommendations',
    aiPoweredEn: 'AI-powered recommendations',
    privacyFirst: 'Privacy First',
    privacyFirstEn: 'Privacy First',
    noData: 'No personal data collection',
    noDataEn: 'No personal data collection',
  }
}

const LanguageContext = createContext<LanguageContextType & { t: TranslationFn } | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('locale') as Locale
    if (saved && locales.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
  }

  const t: TranslationFn = (key: string, params?: Record<string, string | number>) => {
    const lang = translations[locale] || translations.en
    let text = lang[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      })
    }
    return text
  }

  if (!mounted) {
    const fallbackT: TranslationFn = (key: string) => translations[defaultLocale][key] || key
    return (
      <LanguageContext.Provider value={{ locale: defaultLocale, setLocale: () => {}, t: fallbackT }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
