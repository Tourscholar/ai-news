'use client'

import { useState } from 'react'
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover-lift"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className={cn(
                "absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-float",
                isHovered && "animate-ping"
              )} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">AI News</span>
              <span className="text-gradient text-sm font-medium hidden sm:inline-block">Daily</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {['Latest', 'Popular', 'About'].map((item, index) => (
              <a
                key={item}
                href="#"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  "hover:bg-secondary/50 hover:scale-105",
                  index === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-secondary/50 transition-all duration-300 hover-scale hover-glow"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover-scale hover:-translate-y-0.5 btn-premium">
              <Sparkles className="w-4 h-4" />
              Subscribe
            </button>
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-secondary/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 glass-card -mx-4 px-4 mt-2 rounded-xl">
            <nav className="flex flex-col gap-2">
              {['Latest', 'Popular', 'About'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary/50 transition-all duration-300 hover-lift"
                >
                  {item}
                </a>
              ))}
              <button className="flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Subscribe
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
