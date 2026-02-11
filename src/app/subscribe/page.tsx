'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Bell, Check, Zap, Lock, Sparkles, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import NewsletterButton from '@/components/NewsletterButton'
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

// Nodemailer API endpoint (configured in src/app/api/subscribe/route.ts)

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
  const popularBadge = locale === 'zh' ? '🔥 最受欢迎' : '🔥 Most Popular'
  const selectBtn = locale === 'zh' ? '选择计划' : 'Select Plan'
  const selectedText = locale === 'zh' ? '已选择' : 'Selected'
  const loginRequired = locale === 'zh' ? '请先登录' : 'Please sign in first'
  const loginToSubscribe = locale === 'zh' ? '登录后订阅' : 'Sign in to subscribe'
  const loadingText = locale === 'zh' ? '订阅中...' : 'Subscribing...'
  const yearlySave = locale === 'zh' ? '年付省 20%' : 'Save 20%'

  const handlePlanSelect = (plan: Plan) => {
    if (plan.paid && !session) return
    // 免费版：触发邮件订阅弹窗
    if (plan.id === 'free') {
      // 这里使用全局事件触发 NewsletterButton 弹窗
      window.dispatchEvent(new CustomEvent('openNewsletter'))
      return
    }
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
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8"
          >
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300 tracking-wider">{locale === 'zh' ? '订阅计划' : 'SUBSCRIPTION'}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            <GlitchText text={locale === 'zh' ? '选择你的计划' : 'Choose Your Plan'} className="text-white" />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-400 max-w-xl mx-auto"
          >
            {subscribeDesc}
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
              className={`relative ${selectedPlan === plan.id ? 'scale-105 z-10' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-75" />
                    <div className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold tracking-wider">
                      {popularBadge}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Card Glow */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${plan.gradient} opacity-0 transition-all duration-300 ${
                selectedPlan === plan.id ? 'opacity-100' : 'group-hover:opacity-30'
              } blur-md`} />
              
              {/* Main Card */}
              <div className={`relative h-full rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? 'bg-slate-900/90 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20'
                  : 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-900/70'
              } ${plan.paid && !session ? 'opacity-60' : ''}`}>
                
                {/* Overlay for paid plans */}
                {plan.paid && !session && (
                  <div className="absolute inset-0 z-10 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/80 border border-indigo-500/30 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-indigo-400" />
                      </div>
                      <p className="text-indigo-300 font-bold">{loginRequired}</p>
                    </motion.div>
                  </div>
                )}
                
                {/* Selected Indicator */}
                {selectedPlan === plan.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}
                
                {/* Card Content */}
                <div className="relative p-6 pt-10">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 * (index + 1) }}
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg ${
                      selectedPlan === plan.id ? 'shadow-indigo-500/30' : ''
                    }`}
                  >
                    {plan.popular ? (
                      <Sparkles className="w-7 h-7 text-white" />
                    ) : (
                      <Zap className="w-7 h-7 text-white" />
                    )}
                  </motion.div>
                  
                  {/* Name */}
                  <h3 className={`text-xl font-bold text-center mb-1 ${
                    selectedPlan === plan.id ? 'text-white' : 'text-slate-200'
                  }`}>
                    {planName(plan)}
                  </h3>
                  
                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                        {plan.price}
                      </span>
                      {plan.id !== 'free' && (
                        <span className="text-slate-500 text-sm">/{locale === 'zh' ? '月' : 'mo'}</span>
                      )}
                    </div>
                    {plan.id !== 'free' && (
                      <p className="text-xs text-slate-500 mt-0.5">{yearlySave}</p>
                    )}
                  </div>
                  
                  {/* Divider */}
                  <div className={`h-px mb-4 ${
                    selectedPlan === plan.id ? 'bg-gradient-to-r from-indigo-500/50 to-purple-500/50' : 'bg-slate-700/50'
                  }`} />
                  
                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {getPlanFeatures(plan).map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 * (index + 1) + 0.05 * i }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          selectedPlan === plan.id ? 'bg-indigo-500/20' : 'bg-slate-800'
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${selectedPlan === plan.id ? 'text-indigo-400' : 'text-slate-600'}`} />
                        </div>
                        <span className={selectedPlan === plan.id ? 'text-slate-200' : 'text-slate-400'}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Button */}
                  <motion.button
                    whileHover={plan.paid && !session ? {} : { scale: 1.02 }}
                    whileTap={plan.paid && !session ? {} : { scale: 0.98 }}
                    className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${
                      selectedPlan === plan.id
                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    } ${plan.paid && !session ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={plan.paid && !session}
                  >
                    {selectedPlan === plan.id ? selectedText : loginToSubscribe}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm">
            © 2026 <span className="text-indigo-400">AI News Daily</span>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
