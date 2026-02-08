'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Bell, Check, Plus, Trash2, Zap, Sparkles, Rss, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { NeonCard, GlitchText, CyberButton } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

const Starfield = dynamic(() => import('@/components/effects/Starfield'), { ssr: false })
const MatrixRain = dynamic(() => import('@/components/effects/MatrixRain'), { ssr: false })
const ParticleGrid = dynamic(() => import('@/components/effects/ParticleGrid'), { ssr: false })

interface Subscription {
  id: string
  name: string
  category: string
  url: string
  enabled: boolean
}

export default function SubscribePage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'AI Industry News', category: 'industry', url: '#', enabled: true },
    { id: '2', name: 'Product Launches', category: 'application', url: '#', enabled: true },
    { id: '3', name: 'Policy & Safety', category: 'policy', url: '#', enabled: false },
  ])
  const [subscribed, setSubscribed] = useState(false)

  const categories = [
    { key: 'all', label: '全部', icon: '📰' },
    { key: 'industry', label: '行业动态', icon: '🏢' },
    { key: 'application', label: 'AI 应用', icon: '🚀' },
    { key: 'policy', label: '政策安全', icon: '🛡️' },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, enabled: !sub.enabled } : sub
      )
    )
  }

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Starfield />
        <MatrixRain />
        <ParticleGrid />
      </div>
      
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10 md:hidden" />
      
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <NeonCard glowColor="purple" className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-6">
            <Mail className="w-4 h-4 text-purple-400" />
            <span className="text-xs md:text-sm font-medium">{t('subscribe')}</span>
          </NeonCard>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <GlitchText text={t('navSubscribe')} className="text-white" />
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            订阅你最关心的 AI 新闻分类，每日精选推送直达邮箱
          </p>
        </motion.div>

        {/* Email Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NeonCard glowColor="indigo" className="p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">邮箱订阅</h2>
                <p className="text-sm text-slate-400">每日精选新闻直达你的邮箱</p>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500 transition-all"
                required
              />
              <motion.button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {subscribed ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>已订阅!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    <span>订阅</span>
                  </>
                )}
              </motion.button>
            </form>
            
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                订阅成功！请检查你的邮箱确认订阅
              </motion.div>
            )}
          </NeonCard>
        </motion.div>

        {/* Subscription Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">订阅分类</h2>
            <CyberButton className="px-4 py-2">
              <Plus className="w-4 h-4" />
              <span>添加分类</span>
            </CyberButton>
          </div>
          
          <div className="grid gap-4">
            {subscriptions.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <NeonCard 
                  glowColor={sub.enabled ? 'cyan' : 'indigo'} 
                  className="p-4 md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        sub.enabled 
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' 
                          : 'bg-slate-800/50'
                      }`}>
                        {sub.category === 'industry' && '🏢'}
                        {sub.category === 'application' && '🚀'}
                        {sub.category === 'policy' && '🛡️'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{sub.name}</h3>
                        <p className="text-sm text-slate-400 capitalize">{sub.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleSubscription(sub.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          sub.enabled ? 'bg-green-500' : 'bg-slate-700'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ left: sub.enabled ? 26 : 4 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                      
                      {/* Delete */}
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RSS Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <NeonCard glowColor="pink" className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Rss className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">RSS 订阅</h2>
                <p className="text-sm text-slate-400">使用 RSS 阅读器订阅我们的内容</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <code className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-sm text-slate-300 font-mono">
                https://ai-news-bice.vercel.app/api/rss
              </code>
              <CyberButton 
                className="px-4 py-3"
                onClick={() => {
                  navigator.clipboard.writeText('https://ai-news-bice.vercel.app/api/rss')
                }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>复制链接</span>
              </CyberButton>
            </div>
          </NeonCard>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <NeonCard glowColor="cyan" className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">通知设置</h2>
                <p className="text-sm text-slate-400">管理你的通知偏好</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { label: '重大新闻推送', desc: '当有重大 AI 新闻时立即通知', enabled: true },
                { label: '每日摘要', desc: '每天发送精选新闻摘要', enabled: false },
                { label: '趋势变化提醒', desc: '当新闻趋势发生显著变化时通知', enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30">
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      item.enabled ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: item.enabled ? 26 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </NeonCard>
        </motion.div>
      </main>
    </div>
  )
}
