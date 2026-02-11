'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X, Bell, Check, Loader2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/locales/LanguageContext'

export default function NewsletterCard() {
  const { locale, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
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

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => {
      setSubscribeState('idle')
      setSubscribeMessage('')
      setEmail('')
    }, 300)
  }

  const title = locale === 'zh' ? '订阅邮件简报' : 'Subscribe to Newsletter'
  const subtitle = locale === 'zh' ? '每周精选 AI 新闻，直接发送到你的邮箱' : 'Weekly curated AI news delivered to your inbox'
  const enterEmail = locale === 'zh' ? '输入你的邮箱地址' : 'Enter your email address'
  const subscribeBtn = locale === 'zh' ? '订阅' : 'Subscribe'
  const loadingText = locale === 'zh' ? '订阅中...' : 'Subscribing...'
  const closeText = locale === 'zh' ? '关闭' : 'Close'

  return (
    <>
      {/* Newsletter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500" />
        
        {/* Card content */}
        <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-7 h-7 text-indigo-400" />
            </div>
            
            {/* Text content */}
            <div className="flex-1 text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                {title}
              </h3>
              <p className="text-slate-400 text-sm md:text-base">
                {subtitle}
              </p>
            </div>
            
            {/* Subscribe button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium whitespace-nowrap"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{subscribeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={closeModal}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-slate-900 rounded-2xl max-w-md w-full mx-4 overflow-hidden"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30" />
                
                <div className="relative p-6">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {title}
                    </h3>
                    <p className="text-slate-400 text-sm">{subtitle}</p>
                  </div>

                  {subscribeState === 'success' ? (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 backdrop-blur-xl flex items-center justify-center border border-green-500/30">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                      <p className="text-green-400 font-medium mb-4">{subscribeMessage}</p>
                      <button
                        onClick={closeModal}
                        className="px-6 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl text-white text-sm font-medium hover:bg-white/20 transition-all border border-white/10"
                      >
                        {closeText}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe}>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={enterEmail}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 focus:border-indigo-500/50 focus:outline-none text-white placeholder-slate-500 transition-all text-sm"
                          required
                          disabled={subscribeState === 'loading'}
                        />
                        <motion.button
                          type="submit"
                          disabled={subscribeState === 'loading'}
                          className={`px-5 py-2.5 rounded-xl font-medium text-sm tracking-wide flex items-center gap-2 transition-all ${
                            subscribeState === 'loading'
                              ? 'bg-white/5 text-slate-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'
                          }`}
                          whileHover={subscribeState === 'loading' ? {} : { scale: 1.02, y: -1 }}
                          whileTap={subscribeState === 'loading' ? {} : { scale: 0.98 }}
                        >
                          {subscribeState === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Bell className="w-4 h-4" />
                              <span>{subscribeBtn}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}

                  {subscribeState === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-red-400 text-sm text-center"
                    >
                      {subscribeMessage}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
