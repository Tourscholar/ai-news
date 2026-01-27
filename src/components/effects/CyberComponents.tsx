'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div'
}

export function GlitchText({ text, className, as: Component = 'span' }: GlitchTextProps) {
  // Create motion component
  const MotionComponent = motion.create(Component as any)
  
  const glitchVariants = {
    initial: { x: 0, opacity: 0.7 },
    animate: {
      x: [-2, 2, -2, 0],
      opacity: [0.7, 0, 0.7, 0.7],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: 'loop' as const,
        repeatDelay: 2 + Math.random() * 2,
      },
    },
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <Component className="relative z-10">{text}</Component>
      
      {/* Red layer */}
      <MotionComponent
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-70"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
        initial="initial"
        animate="animate"
        variants={glitchVariants}
      >
        {text}
      </MotionComponent>
      
      {/* Cyan layer */}
      <MotionComponent
        className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-70"
        style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
        initial="initial"
        animate="animate"
        variants={{
          ...glitchVariants,
          animate: {
            ...glitchVariants.animate,
            transition: {
              ...glitchVariants.animate.transition,
              repeatDelay: 3 + Math.random() * 2,
            },
          },
        }}
      >
        {text}
      </MotionComponent>
    </div>
  )
}

interface CyberButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function CyberButton({ children, className, onClick }: CyberButtonProps) {
  return (
    <motion.button
      className={cn(
        'relative px-6 py-3 overflow-hidden rounded-xl font-medium',
        'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
        'text-white shadow-lg shadow-indigo-500/25',
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Scan line */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

interface NeonCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'indigo' | 'purple' | 'pink' | 'cyan'
}

export function NeonCard({ children, className, glowColor = 'indigo' }: NeonCardProps) {
  const colors = {
    indigo: 'rgba(99, 102, 241,',
    purple: 'rgba(139, 92, 246,',
    pink: 'rgba(236, 72, 153,',
    cyan: 'rgba(34, 211, 238,',
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl p-6',
        'bg-slate-900/50 backdrop-blur-xl',
        'border border-slate-700/50',
        className
      )}
      whileHover={{
        scale: 1.01,
        boxShadow: `0 0 30px ${colors[glowColor]}0.3), 0 0 60px ${colors[glowColor]}0.1)`,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: colors[glowColor] }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: colors[glowColor] }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: colors[glowColor] }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: colors[glowColor] }} />
      
      {children}
    </motion.div>
  )
}

interface DataCounterProps {
  value: string | number
  label: string
  icon?: React.ReactNode
}

export function DataCounter({ value, label, icon }: DataCounterProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <motion.span
          className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          animate={{
            textShadow: [
              '0 0 20px rgba(99, 102, 241, 0.5)',
              '0 0 40px rgba(139, 92, 246, 0.5)',
              '0 0 20px rgba(236, 72, 153, 0.5)',
              '0 0 20px rgba(99, 102, 241, 0.5)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {value}
        </motion.span>
      </div>
      <div className="text-sm text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  )
}
