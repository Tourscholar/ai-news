'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Bell, Check, Loader2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/locales/LanguageContext'

export default function NewsletterCard() {
  const { locale, t } = useLanguage()
  const [email, setEmail] = useState('')
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

  const title = locale === 'zh' ? '订阅邮件简报' : 'Subscribe'
  const subtitle = locale === 'zh' ? '每周精选 AI 新闻' : 'Weekly AI news'
  const enterEmail = locale === 'zh' ? '输入邮箱' : 'Email'
  const subscribeBtn = locale === 'zh' ? '订阅' : 'Subscribe'
  const loadingText = locale === 'zh' ? '订阅中...' : 'Subscribing...'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative group"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-500" />
      
      {/* Card content */}
      <div className="relative rounded-xl bg-slate-900/80 backdrop-blur-xl p-4">
        {subscribeState === 'success' ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 backdrop-blur-xl flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-green-400 text-sm font-medium truncate">{subscribeMessage}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-indigo-400" />
            </div>
            
            {/* Text content */}
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-white text-sm font-medium">{title}</p>
              <p className="text-slate-500 text-xs truncate">{subtitle}</p>
            </div>
            
            {/* Email input */}
            <div className="flex-1 min-w-0 sm:flex-none sm:w-40">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={enterEmail}
                className="w-full px-3 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 focus:border-indigo-500/50 focus:outline-none text-white placeholder-slate-500 transition-all text-sm"
                required
                disabled={subscribeState === 'loading'}
              />
            </div>
            
            {/* Subscribe button */}
            <motion.button
              type="submit"
              disabled={subscribeState === 'loading'}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                subscribeState === 'loading'
                  ? 'bg-white/5 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'
              }`}
              whileHover={subscribeState === 'loading' ? {} : { scale: 1.02, y: -1 }}
              whileTap={subscribeState === 'loading' ? {} : { scale: 0.98 }}
            >
              {subscribeState === 'loading' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">{subscribeBtn}</span>
                  <span className="sm:hidden">{subscribeBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>
        )}

        {subscribeState === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-red-400 text-xs"
          >
            {subscribeMessage}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
