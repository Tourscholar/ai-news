'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X, Bell, Check, Loader2 } from 'lucide-react'
import { useLanguage } from '@/locales/LanguageContext'

export default function NewsletterButton() {
  const { locale } = useLanguage()
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

  const enterEmail = locale === 'zh' ? '输入你的邮箱地址' : 'Enter your email'
  const weeklyDigest = locale === 'zh' ? '每周精选 AI 新闻，直接发送到你的邮箱' : 'Weekly curated AI news delivered to your inbox.'
  const subscribeBtn = locale === 'zh' ? '订阅' : 'Subscribe'
  const loadingText = locale === 'zh' ? '订阅中...' : 'Subscribing...'
  const closeText = locale === 'zh' ? '关闭' : 'Close'

  return (
    <>
      {/* 按钮：玻璃拟态效果，渐变边框，悬浮上浮 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-1.5 px-5 py-2.5 text-white text-sm font-medium overflow-hidden rounded-xl"
        style={{
          height: '44px',
        }}
        title={locale === 'zh' ? '邮件简报' : 'Newsletter'}
        whileHover={{ 
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 玻璃拟态背景 */}
        <div className="absolute inset-0 rounded-xl backdrop-blur-xl bg-white/10" />
        
        {/* 渐变边框 */}
        <div className="absolute inset-0 rounded-xl p-[1px]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        </div>
        
        {/* 按钮内容 */}
        <div className="relative z-10 flex items-center gap-1.5">
          <Mail className="w-[18px] h-[18px]" />
          <span className="hidden sm:inline">{locale === 'zh' ? '邮件简报' : 'Newsletter'}</span>
        </div>
      </motion.button>

      {/* 弹窗：居中显示，玻璃拟态卡片，24px 大圆角 */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            {/* 弹窗卡片：玻璃拟态，24px 圆角 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full max-w-md"
            >
              {/* 渐变边框 */}
              <div className="absolute -inset-0.5 rounded-[26px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-sm" />
              
              {/* 玻璃拟态卡片 */}
              <div className="relative rounded-[24px] overflow-hidden">
                <div className="absolute inset-0 rounded-[24px] backdrop-blur-2xl bg-slate-900/70" />
                
                <div className="relative p-6">
                  {/* 关闭按钮 */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                      className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center"
                    >
                      <Mail className="w-6 h-6 text-indigo-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {locale === 'zh' ? '邮件简报' : 'Email Newsletter'}
                    </h3>
                    <p className="text-slate-400 text-sm">{weeklyDigest}</p>
                  </div>

                  {subscribeState === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
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
                    </motion.div>
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
