'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Bell, Check, Rss, Zap, ExternalLink, ArrowRight, Lock } from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { GlitchText } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

const Starfield = dynamic(() => import('@/components/effects/Starfield'), { ssr: false })
const MatrixRain = dynamic(() => import('@/components/effects/MatrixRain'), { ssr: false })
const ParticleGrid = dynamic(() => import('@/components/effects/ParticleGrid'), { ssr: false })

interface Plan {
  id: string
  name: string
  nameEn: string
  price: string
  priceEn: string
  features: string[]
  featuresEn: string[]
  popular?: boolean
  paid?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: '免费版',
    nameEn: 'Free',
    price: '¥0',
    priceEn: '$0',
    features: ['每日精选 10 篇', '基础分类筛选', 'RSS 订阅'],
    featuresEn: ['10 Daily Picks', 'Basic Filters', 'RSS Feed'],
  },
  {
    id: 'pro',
    name: '专业版',
    nameEn: 'Pro',
    price: '¥29/月',
    priceEn: '$29/mo',
    features: ['无限新闻订阅', 'AI 摘要生成', '实时推送', '自定义关键词'],
    featuresEn: ['Unlimited News', 'AI Summary', 'Real-time Push', 'Custom Keywords'],
    popular: true,
    paid: true,
  },
  {
    id: 'team',
    name: '团队版',
    nameEn: 'Team',
    price: '¥99/月',
    priceEn: '$99/mo',
    features: ['多成员管理', 'API 权限', '技术支持', '数据导出'],
    featuresEn: ['Team Members', 'API Access', 'Priority Support', 'Data Export'],
    paid: true,
  },
]

export default function SubscribePage() {
  const { data: session } = useSession()
  const { locale } = useLanguage()
  const [email, setEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [subscribeState, setSubscribeState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscribeMessage, setSubscribeMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSubscribeState('loading')
    setSubscribeMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubscribeState('success')
        setSubscribeMessage(
          locale === 'zh' 
            ? `订阅成功！${email} 已加入邮件列表` 
            : `Subscribed! ${email} added to newsletter`
        )
        setEmail('')
      } else {
        setSubscribeState('error')
        setSubscribeMessage(data.error || (locale === 'zh' ? '订阅失败' : 'Failed to subscribe'))
      }
    } catch {
      setSubscribeState('error')
      setSubscribeMessage(locale === 'zh' ? '订阅失败，请重试' : 'Failed to subscribe, please try again')
    }
  }

  const getPlanFeatures = (plan: Plan) => locale === 'zh' ? plan.features : plan.featuresEn
  const planName = (plan: Plan) => locale === 'zh' ? plan.name : plan.nameEn
  
  const subscribeDesc = locale === 'zh'
    ? '获取最新的 AI 新闻资讯，个性化推荐，让信息主动找到你'
    : 'Get the latest AI news and insights personalized for you.'
    
  const weeklyDigest = locale === 'zh'
    ? '每周精选 AI 新闻，直接发送到你的邮箱'
    : 'Weekly curated AI news delivered to your inbox.'
    
  const enterEmail = locale === 'zh' ? '输入你的邮箱地址' : 'Enter your email'
  const rssSubscribe = locale === 'zh' ? '使用 RSS 阅读器订阅' : 'Subscribe with RSS reader'
  const copyText = locale === 'zh' ? '复制' : 'Copy'
  const popularBadge = locale === 'zh' ? '最受欢迎' : 'Most Popular'
  const selectBtn = locale === 'zh' ? '选择计划' : 'Select Plan'
  const selectedText = locale === 'zh' ? '已选择' : 'Selected'
  const loginRequired = locale === 'zh' ? '请先登录' : 'Please sign in first'
  const loginToSubscribe = locale === 'zh' ? '登录后订阅' : 'Sign in to subscribe'
  const loadingText = locale === 'zh' ? '订阅中...' : 'Subscribing...'

  const handlePlanSelect = (plan: Plan) => {
    if (plan.paid && !session) return
    setSelectedPlan(plan.id)
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Starfield />
        <MatrixRain />
        <ParticleGrid />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-indigo-300">{locale === 'zh' ? '订阅' : 'Subscribe'}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <GlitchText text={locale === 'zh' ? '选择你的订阅计划' : 'Choose Your Plan'} className="text-white" />
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subscribeDesc}</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`relative rounded-2xl border overflow-hidden ${
                selectedPlan === plan.id
                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
              } ${plan.paid && !session ? 'opacity-60' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              {/* Overlay for paid plans */}
              {plan.paid && !session && (
                <div className="absolute -inset-2 z-50 flex flex-col items-center justify-center rounded-2xl bg-slate-950/60 backdrop-blur-sm border border-slate-700/50">
                  <Lock className="w-12 h-12 text-indigo-400 mb-3" />
                  <p className="text-indigo-300 font-medium text-lg">{loginRequired}</p>
                  <p className="text-slate-400 text-sm mt-2">{locale === 'zh' ? '点击右上角登录' : 'Sign in from top right'}</p>
                </div>
              )}
              
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium z-20">
                  {popularBadge}
                </div>
              )}
              
              {/* Card content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{planName(plan)}</h3>
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
                    {locale === 'zh' ? plan.price : plan.priceEn}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {getPlanFeatures(plan).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  } ${plan.paid && !session ? 'cursor-not-allowed opacity-50' : ''}`}
                  whileHover={plan.paid && !session ? {} : { scale: 1.02 }}
                  whileTap={plan.paid && !session ? {} : { scale: 0.98 }}
                  disabled={plan.paid && !session}
                >
                  {selectedPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />{selectedText}
                    </span>
                  ) : plan.paid && !session ? (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />{loginToSubscribe}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {selectBtn}<ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-slate-700/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {locale === 'zh' ? '邮件简报' : 'Email Newsletter'}
              </h2>
              <p className="text-slate-400">{weeklyDigest}</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={enterEmail}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500 transition-all"
                required
                disabled={subscribeState === 'loading'}
              />
              <motion.button
                type="submit"
                disabled={subscribeState === 'loading'}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50"
                whileHover={subscribeState === 'loading' ? {} : { scale: 1.02 }}
                whileTap={subscribeState === 'loading' ? {} : { scale: 0.98 }}
              >
                {subscribeState === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingText}</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>{locale === 'zh' ? '订阅' : 'Subscribe'}</span>
                  </>
                )}
              </motion.button>
            </form>
            
            {subscribeState === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>{subscribeMessage}</span>
              </motion.div>
            )}
            
            {subscribeState === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center"
              >
                {subscribeMessage}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* RSS Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Rss className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">RSS Feed</h3>
                <p className="text-sm text-slate-400">{rssSubscribe}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-800 text-sm text-slate-400 font-mono truncate">
                https://ai-news-bice.vercel.app/api/rss
              </code>
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors shrink-0"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigator.clipboard.writeText('https://ai-news-bice.vercel.app/api/rss')}
              >
                <ExternalLink className="w-4 h-4" />
                <span>{copyText}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm">
            © 2026 AI News Daily · {locale === 'zh' ? '基于 Next.js 构建' : 'Built with Next.js'} · {locale === 'zh' ? '部署于 Vercel' : 'Deployed on Vercel'}
          </p>
        </motion.div>
      </main>
    </div>
  )
}
