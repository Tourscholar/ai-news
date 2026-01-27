'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { locales, Locale } from './index'

const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English'
}

const localeFlags: Record<Locale, string> = {
  zh: '🇨🇳',
  en: '🇺🇸'
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-300 hidden sm:inline">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-36 glass-card rounded-xl overflow-hidden z-50"
            >
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLocale(l)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-3 text-sm transition-all ${
                    locale === l
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{localeFlags[l]}</span>
                  <span>{localeNames[l]}</span>
                  {locale === l && (
                    <motion.div 
                      layoutId="activeLocale"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
