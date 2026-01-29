'use client'

import { Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Github, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/locales/LanguageContext'

function SignInContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t('backHome')}</span>
        </Link>

        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AI News Daily</span>
        </motion.div>

        {/* Sign In Card */}
        <motion.div
          className="glass-card rounded-2xl p-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {t('signInTitle')}
          </h1>
          <p className="text-slate-400 text-center mb-8">
            {t('signInDesc')}
          </p>

          {/* GitHub OAuth Button */}
          <motion.button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium transition-all border border-slate-700/50 hover:border-slate-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5" />
            <span>{t('continueWithGithub')}</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-sm text-slate-500">{t('or')}</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>{t('benefit1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>{t('benefit2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>{t('benefit3')}</span>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-slate-500 text-center mt-8">
            {t('privacyNote')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SignInContent />
    </Suspense>
  )
}
