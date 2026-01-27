'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Github, 
  LogOut, 
  User, 
  ChevronDown,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="h-10 w-24 bg-slate-800/50 rounded-lg animate-pulse" />
    )
  }

  if (session) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all"
          whileHover={{ scale: 1.02 }}
        >
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-sm text-slate-300 hidden sm:inline max-w-[100px] truncate">
            {session.user?.name}
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-400 transition-transform",
            menuOpen && "rotate-180"
          )} />
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl p-2 shadow-xl z-50"
            >
              <div className="px-3 py-2 border-b border-slate-700/50 mb-2">
                <p className="text-sm font-medium text-white truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {session.user?.email}
                </p>
              </div>
              
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside to close */}
        {menuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setMenuOpen(false)} 
          />
        )}
      </div>
    )
  }

  return (
    <motion.button
      onClick={() => signIn()}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium shadow-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Sparkles className="w-4 h-4" />
      <span>Sign In</span>
    </motion.button>
  )
}
