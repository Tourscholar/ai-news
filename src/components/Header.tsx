'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlitchText } from '@/components/effects/CyberComponents'
import AuthButton from '@/components/auth/AuthButton'
import LanguageSwitcher from '@/locales/LanguageSwitcher'
import { useLanguage } from '@/locales/LanguageContext'

export default function Header() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const navItems = [
    { key: 'navLatest', href: '#' },
    { key: 'navPopular', href: '#' },
    { key: 'navAbout', href: '#' },
  ]

  return (
    <motion.header
      className="sticky top-0 z-50 w-full glass-header border-b border-slate-800/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: isHovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-cyan-400 rounded-full"
                animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <GlitchText
                text={t('siteTitle')}
                className="font-bold text-lg md:text-xl tracking-tight"
                as="span"
              />
              <motion.span
                className="text-gradient text-xs md:text-sm font-medium hidden sm:inline-block"
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                  x: isHovered ? 0 : -3,
                }}
              >
                {t('siteSubtitle')}
              </motion.span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  index === 0 ? "text-white" : "text-slate-400 hover:text-white"
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">{t(item.key)}</span>
                {index === 0 && (
                  <motion.div
                    className="absolute inset-0 bg-slate-800/50 rounded-lg"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>

          {/* Actions - Language + Auth + Subscribe */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher />
            <AuthButton />
            
            <motion.button
              className="hidden sm:flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg md:rounded-xl text-sm font-medium shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{t('subscribe')}</span>
            </motion.button>
            
            <motion.button
              className="md:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="md:hidden overflow-hidden"
            >
              <motion.div
                className="py-4 border-t border-slate-700/50 glass-card -mx-4 px-4 mt-2 rounded-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.key}
                      href={item.href}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t(item.key)}
                    </motion.a>
                  ))}
                  <div className="border-t border-slate-700/50 my-2 pt-2">
                    <motion.button
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-4 h-4" />
                      {t('subscribe')}
                    </motion.button>
                  </div>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
