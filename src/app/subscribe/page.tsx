'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Bell, Check, Rss, Zap, ExternalLink, Lock, Sparkles, ArrowRight } from 'lucide-react'
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
  priceMonthly: string
  priceMonthlyEn: string
  features: string[]
  featuresEn: string[]
  popular?: boolean
  paid?: boolean
  gradient: string
}

const plans: Plan[] = [
  {
    id: 'free',
    name: '免费版',
    nameEn: 'Free',
    price: '¥0',
    priceEn: '$0',
    priceMonthly: '¥0/月',
    priceMonthlyEn: '$0/mo',
    features: ['每日精选 10 篇', '基础分类筛选', 'RSS 订阅'],
    featuresEn: ['10 Daily Picks', 'Basic Filters', 'RSS Feed'],
    gradient: 'from-slate-500 to-slate-600',
  },
  {
    id: 'pro',
    name: '专业版',
    nameEn: 'Pro',
    price: '¥29',
    priceEn: '$29',
    priceMonthly: '¥29/月',
    priceMonthlyEn: '$29/mo',
    features: ['无限新闻订阅', 'AI 摘要生成', '实时推送', '自定义关键词'],
    featuresEn: ['Unlimited News', 'AI Summary', 'Real-time Push', 'Custom Keywords'],
    popular: true,
    paid: true,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  {
    id: 'team',
    name: '团队版',
    nameEn: 'Team',
    price: '¥99',
    priceEn: '$99',
    priceMonthly: '¥99/月',
    priceMonthlyEn: '$99/mo',
    features: ['多成员管理', 'API 权限', '技术支持', '数据导出'],
    featuresEn: ['Team Members', 'API Access', 'Priority Support', 'Data Export'],
    paid: true,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
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
  const planPrice = (plan: Plan) => locale === 'zh' ? plan.priceMonthly : plan.priceMonthlyEn
  
  const subscribeDesc = locale === 'zh'
    ? '获取最新的 AI 新闻资讯，个性化推荐，让信息主动找到你'
    : 'Get the latest AI news and insights personalized for you.'
    
  const weeklyDigest = locale === 'zh'
    ? '每周精选 AI 新闻，直接发送到你的邮箱'
    : 'Weekly curated AI news delivered to your inbox.'
    
  const enterEmail = locale === 'zh' ? '输入你的邮箱地址' : 'Enter your email'
  const rssSubscribe = locale === 'zh' ? '使用 RSS 阅读器订阅' : 'Subscribe with RSS reader'
  const copyText = locale === 'zh' ? '复制' : 'Copy'
  const popularBadge = locale === 'zh' ? '🔥 最受欢迎' : '🔥 Most Popular'
  const selectBtn = locale === 'zh' ? '选择计划' : 'Select Plan'
  const selectedText = locale === 'zh' ? '✓ 已选择' : '✓ Selected'
  const loginRequired = locale === 'zh' ? '请先登录' : 'Please sign in first'
  const loginToSubscribe = locale === 'zh' ? '登录后订阅' : 'Sign in to subscribe'
  const loadingText = locale === 'zh' ? '订阅中...' : 'Subscribing...'
  const yearlySave = locale === 'zh' ? '年付省 20%' : 'Save 20% with yearly'

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
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 -z-10" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8"
          >
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300 tracking-wider">{locale === 'zh' ? '订阅计划' : 'SUBSCRIPTION PLANS'}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <GlitchText text={locale === 'zh' ? '选择你的计划' : 'Choose Your Plan'} className="text-white" />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {subscribeDesc}
          </motion.p>
        </motion.div>

        {/* Pricing Cards - Cyberpunk Style */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
              className={`relative group ${selectedPlan === plan.id ? 'scale-105' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              {/* Popular Badge - Floating Above */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-5 left-1/2 -translate-x-1/2 z-30"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-75 animate-pulse" />
                    <div className="relative px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-bold tracking-wider shadow-lg">
                      {popularBadge}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Card Glow Effect */}
              <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500 ${selectedPlan === plan.id ? 'opacity-75' : ''}`} />
              
              {/* Main Card */}
              <div className={`relative h-full rounded-3xl overflow-hidden transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'bg-slate-900/90 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20'
                  : 'bg-slate-900/60 border border-slate-700/50 hover:border-slate-600'
              } ${plan.paid && !session ? 'opacity-70' : ''}`}>
                
                {/* Overlay for paid plans */}
                {plan.paid && !session && (
                  <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/80 border border-indigo-500/30 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-indigo-400" />
                      </div>
                      <p className="text-indigo-300 font-bold text-xl mb-2">{loginRequired}</p>
                      <p className="text-slate-500 text-sm">{locale === 'zh' ? '登录后解锁更多功能' : 'Sign in to unlock'}</p>
                    </motion.div>
                  </div>
                )}
                
                {/* Card Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,transparent_50%,rgba(255,255,255,.1)_50%,transparent_75%,rgba(255,255,255,.1)_75%)] bg-[length:8px_8px]" />
                </div>
                
                {/* Card Content */}
                <div className="relative p-8 pt-12">
                  {/* Plan Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 * (index + 1) }}
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg ${
                      selectedPlan === plan.id ? 'shadow-indigo-500/30' : ''
                    }`}
                  >
                    {plan.popular ? (
                      <Sparkles className="w-8 h-8 text-white" />
                    ) : (
                      <Zap className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                  
                  {/* Plan Name */}
                  <h3 className={`text-2xl font-bold text-center mb-2 ${
                    selectedPlan === plan.id ? 'text-white' : 'text-slate-200'
                  }`}>
                    {planName(plan)}
                  </h3>
                  
                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                        {plan.price}
                      </span>
                      {plan.id !== 'free' && (
                        <span className="text-slate-500 text-lg">/{locale === 'zh' ? '月' : 'mo'}</span>
                      )}
                    </div>
                    {plan.id !== 'free' && (
                      <p className="text-sm text-slate-500 mt-1">{yearlySave}</p>
                    )}
                  </div>
                  
                  {/* Divider */}
                  <div className="relative h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6">
                    {selectedPlan === plan.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    )}
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {getPlanFeatures(plan).map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 * (index + 1) + 0.1 * i }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          selectedPlan === plan.id
                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                            : 'bg-slate-800'
                        }`}>
                          <Check className={`w-3.5 h-3.5 ${selectedPlan === plan.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                        </div>
                        <span className={`text-sm ${selectedPlan === plan.id ? 'text-slate-200' : 'text-slate-400'}`}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Select Button */}
                  <motion.button
                    whileHover={plan.paid && !session ? {} : { scale: 1.02 }}
                    whileTap={plan.paid && !session ? {} : { scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider transition-all ${
                      selectedPlan === plan.id
                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    } ${plan.paid && !session ? 'cursor-not-allowed opacity-50' : ''}`}
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
                
                {/* Selected Glow */}
                {selectedPlan === plan.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 30px rgba(99, 102, 241, 0.1)',
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl" />
            
            <div className="relative p-10 rounded-3xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                >
                  <Mail className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {locale === 'zh' ? '邮件简报' : 'Email Newsletter'}
                </h2>
                <p className="text-slate-400">{weeklyDigest}</p>
              </div>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={enterEmail}
                  className="flex-1 px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-600 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500 transition-all"
                  required
                  disabled={subscribeState === 'loading'}
                />
                <motion.button
                  type="submit"
                  disabled={subscribeState === 'loading'}
                  className={`px-8 py-4 rounded-xl font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                    subscribeState === 'loading'
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  }`}
                  whileHover={subscribeState === 'loading' ? {} : { scale: 1.02 }}
                  whileTap={subscribeState === 'loading' ? {} : { scale: 0.98 }}
                >
                  {subscribeState === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{loadingText}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      <span>{locale === 'zh' ? '订阅' : 'Subscribe'}</span>
                    </>
                  )}
                </motion.button>
              </form>
              
              {subscribeState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-medium">{subscribeMessage}</span>
                </motion.div>
              )}
              
              {subscribeState === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center"
                >
                  {subscribeMessage}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* RSS Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 max-w-xl mx-auto"
        >
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-700/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                <Rss className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">RSS Feed</h3>
                <p className="text-sm text-slate-400 truncate">{rssSubscribe}</p>
              </div>
              <motion.button
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.clipboard.writeText('https://ai-news-bice.vercel.app/api/rss')}
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />{copyText}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 text-sm">
            © 2026 <span className="text-indigo-400">AI News Daily</span> · {locale === 'zh' ? '基于 Next.js 构建' : 'Built with Next.js'}
          </p>
        </motion.div>
      </main>
    </div>
  )
}
