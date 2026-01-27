'use client'

import { Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Github, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Custom Google Icon SVG
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function SignInContent() {
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
          <span className="text-sm">Back to Home</span>
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
            Welcome Back
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Sign in to access your personalized AI news feed
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <motion.button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium transition-all border border-slate-700/50 hover:border-slate-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </motion.button>

            <motion.button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium transition-all border border-slate-700/50 hover:border-slate-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Personalized news recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Save and bookmark articles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Real-time notifications</span>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-slate-500 text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We only access your basic profile information.
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
