'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Bell, Check, Rss, Zap, ExternalLink } from 'lucide-react'
import { NeonCard } from '@/components/effects/CyberComponents'
import { useLanguage } from '@/locales/LanguageContext'

interface Subscription {
  id: string
  name: string
  nameEn: string
  category: string
  enabled: boolean
}

export default function SubscribeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  
  const subscriptions: Subscription[] = [
    { id: '1', name: '行业动态', nameEn: 'Industry News', category: 'industry', enabled: true },
    { id: '2', name: 'AI 应用', nameEn: 'AI Applications', category: 'application', enabled: true },
    { id: '3', name: '政策安全', nameEn: 'Policy & Safety', category: 'policy', enabled: false },
    { id: '4', name: '热门趋势', nameEn: 'Trending', category: 'trending', enabled: true },
  ]

  const [subs, setSubs] = useState(subscriptions)

  const categories = [
    { key: 'all', label: locale === 'zh' ? '全部' : 'All', icon: '📰' },
    { key: 'industry', label: locale === 'zh' ? '行业动态' : 'Industry', icon: '🏢' },
    { key: 'application', label: locale === 'zh' ? 'AI 应用' : 'AI Apps', icon: '🚀' },
    { key: 'policy', label: locale === 'zh' ? '政策安全' : 'Policy', icon: '🛡️' },
    { key: 'trending', label: locale === 'zh' ? '热门趋势' : 'Trending', icon: '🔥' },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const toggleSubscription = (id: string) => {
    setSubs(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ))
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category)
    return cat?.icon || '📰'
  }

  const getCategoryName = (sub: Subscription) => {
    return locale === 'zh' ? sub.name : sub.nameEn
  }

  const subscribeSuccessText = locale === 'zh' ? '订阅成功！请查收确认邮件' : t('subscribeSuccess')
  const emailPlaceholder = t('emailPlaceholder')
  const emailLabel = t('emailLabel')
  const subscribeCategories = t('subscribeCategories')
  const notificationSettings = t('notificationSettings')
  const breakingNews = t('breakingNews')
  const dailyDigest = t('dailyDigest')
  const trendChanges = t('trendChanges')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[80vh] overflow-hidden z-50"
          >
            <NeonCard glowColor="purple" className="h-full flex flex-col bg-slate-900/95 border-slate-700">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{t('subscribe')}</h2>
                    <p className="text-sm text-slate-400">
                      {locale === 'zh' ? '订阅你最关心的 AI 新闻' : 'Subscribe to AI news you care about'}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Email Form */}
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">{emailLabel}</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={emailPlaceholder}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500 transition-all"
                      required
                    />
                    <motion.button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Bell className="w-4 h-4" />
                      <span>{t('subscribe')}</span>
                    </motion.button>
                  </div>
                  {subscribed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>{subscribeSuccessText}</span>
                    </motion.div>
                  )}
                </form>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-3">{subscribeCategories}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {subs.map((sub) => (
                      <motion.div
                        key={sub.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          sub.enabled ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/50'
                        }`}
                        onClick={() => toggleSubscription(sub.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{getCategoryIcon(sub.category)}</span>
                          <div className={`w-8 h-4 rounded-full transition-colors ${sub.enabled ? 'bg-green-500' : 'bg-slate-600'}`}>
                            {sub.enabled && (
                              <motion.div className="w-3 h-3 bg-white rounded-full mt-0.5 ml-0.5" layoutId="toggle" />
                            )}
                          </div>
                        </div>
                        <p className="font-medium text-white">{getCategoryName(sub)}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* RSS */}
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Rss className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-white">RSS Feed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-slate-900/50 text-xs text-slate-400 font-mono truncate">
                      https://ai-news-bice.vercel.app/api/rss
                    </code>
                    <motion.button
                      onClick={() => navigator.clipboard.writeText('https://ai-news-bice.vercel.app/api/rss')}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                    </motion.button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    {notificationSettings}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'major', label: breakingNews, enabled: true },
                      { key: 'daily', label: dailyDigest, enabled: false },
                      { key: 'trend', label: trendChanges, enabled: true },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                        <span className="text-sm text-slate-300">{item.label}</span>
                        <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-green-500' : 'bg-slate-600'}`} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
            </NeonCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
