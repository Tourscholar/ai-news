# Footer 设计规范

## 1. 布局结构

```
┌─────────────────────────────────────────────────────────────┐
│                    Footer Container                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Center Aligned                        │    │
│  │                                                     │    │
│  │   [Logo]  AI News Daily    [RSS]     ← Left        │    │
│  │                                                     │    │
│  │           ← Empty (no email card) →                  │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 2. 组件设计

### 2.1 基础结构

```tsx
// src/components/Footer.tsx
import { Rss } from 'lucide-react'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-700/30 glass mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-slate-300 text-sm">
              AI News Daily
            </span>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-slate-700" />
          
          {/* Left: RSS Link */}
          <a
            href="/api/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-300 text-sm"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS</span>
          </a>
          
          {/* Right: Empty (reserved for future) */}
          <div className="flex-1" />
          
        </div>
      </div>
    </footer>
  )
}
```

### 2.2 居中布局 CSS

```css
/* 使用 Flexbox 实现居中 */
footer {
  @apply w-full mt-auto;
}

footer .container {
  @apply flex items-center justify-center;
}

/* 如果需要真正的居中（左右对称） */
footer .content-wrapper {
  @apply flex items-center justify-between;
  max-width: 1200px; /* 与 Header 一致 */
  margin: 0 auto;
}
```

## 3. 样式规格

### 3.1 尺寸规范

| 元素 | 尺寸 | 说明 |
|------|------|------|
| Logo 图标 | 24×24px (w-6 h-6) | 与 Header 保持一致比例 |
| RSS 图标 | 14×14px (w-3.5 h-3.5) | 略小于 Logo |
| 间距 | 16px (gap-4) | 元素间水平间距 |
| 容器内边距 | 24px (py-6) | 上下内边距 |
| 分隔线 | 1×16px (w-px h-4) | 视觉分隔 |

### 3.2 颜色规范

```css
/* 背景 */
.bg-footer {
  background: rgba(15, 23, 42, 0.8); /* slate-900/80 */
}

/* 边框 */
.border-footer {
  border-color: rgba(51, 65, 85, 0.3); /* slate-700/30 */
}

/* 文字颜色 */
.text-primary {
  color: rgb(203, 213, 225); /* slate-300 */
}

.text-secondary {
  color: rgb(148, 163, 184); /* slate-400 */
}

.text-hover {
  color: rgb(255, 255, 255); /* white */
}
```

### 3.3 交互状态

```css
/* RSS 链接 hover 效果 */
.rss-link {
  @apply text-slate-400 transition-colors duration-300;
}

.rss-link:hover {
  @apply text-white;
}

/* 可选：添加微光效果 */
.rss-link:hover svg {
  @apply text-orange-400;
}
```

## 4. 集成到 Layout

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'  // 导入 Footer

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="scrollbar-premium">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />  {/* 添加 Footer */}
      </body>
    </html>
  )
}
```

## 5. 响应式设计

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-slate-700/30 glass mt-auto">
      {/* Mobile: 紧凑布局 */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-center gap-3 md:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
            </div>
            <span className="text-xs md:text-sm text-slate-300 font-medium">
              AI News Daily
            </span>
          </div>
          
          {/* 分隔线 */}
          <div className="w-px h-3 md:h-4 bg-slate-700" />
          
          {/* RSS */}
          <a
            href="/api/rss"
            className="flex items-center gap-1 text-xs md:text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Rss className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>RSS</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
```

## 6. 动画效果 (可选)

```tsx
import { motion } from 'framer-motion'

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="border-t border-slate-700/30 glass mt-auto"
    >
      {/* content */}
    </motion.footer>
  )
}
```

## 7. 设计要点

| 要求 | 实现方式 |
|------|----------|
| 底部居中 | `flex items-center justify-center` |
| 左侧 Logo + RSS | 左侧定位，中间展示 |
| 右侧空白 | `flex-1` 占位或完全不添加 |
| 整体居中 | `container mx-auto` + `max-width` 限制 |
| 风格统一 | 与 Header 使用相同颜色、间距系统 |

## 8. 注意事项

1. **不要添加邮件卡片** - 右侧保持空白
2. **保持简洁** - Footer 不应过于复杂
3. **样式统一** - 使用与项目一致的玻璃拟态风格
4. **无障碍** - 确保文字对比度足够
5. **轻量化** - 避免过度动画影响性能
