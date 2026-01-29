# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI News Daily is a bilingual (Chinese/English) AI news aggregation web app built with Next.js 14 App Router. It aggregates AI news from multiple RSS sources and Hacker News.

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Next.js linting
```

## Architecture

### App Router Structure (`src/app/`)
- `page.tsx` - Home page with hero section, news list, and back-to-top functionality
- `popular/page.tsx` - Hacker News popular stories page
- `github/page.tsx` - GitHub Trending page
- `auth/signin/page.tsx` - GitHub OAuth sign-in page
- `api/news/route.ts` - Aggregates RSS feeds from MIT News, Google News, Hacker News, TechCrunch, The Verge, Wired, Ars Technica, MIT Tech Review
- `api/popular/route.ts` - Fetches top stories from Hacker News Firebase API
- `api/github/route.ts` - Fetches GitHub trending repositories

### Key Components (`src/components/`)
- `Header.tsx` - Navigation with language switcher and auth button
- `NewsList.tsx` - News display with category filtering (all/industry/application/policy/other), auto-refresh every 30min
- `auth/` - NextAuth.js authentication components (AuthProvider, AuthButton)
- `effects/` - Visual effects: Starfield, MatrixRain, ParticleGrid, CyberComponents (NeonCard, GlitchText, CyberButton)

### Data Layer (`src/lib/`)
- `utils.ts` - `cn()` helper combining clsx and tailwind-merge for className composition

### Internationalization (`src/locales/`)
- `LanguageContext.tsx` - Client-side language state management (zh/en)
- `LanguageSwitcher.tsx` - Language toggle component
- Translations stored inline in `translations` object (zh/en dictionaries)

### State Management
- React Context for language state (`LanguageProvider`)
- NextAuth.js session context (`AuthProvider`)
- Local component state for news fetching, filtering, UI interactions

## News Categorization

Automatic categorization in `/api/news/route.ts`:
- `industry` - Major companies (Google, OpenAI, Microsoft, Nvidia, Meta, etc.)
- `application` - Product launches, features, tools
- `policy` - Regulations, laws, safety, privacy, governance
- `other` - Default fallback

## Data Sources

- Google News RSS, MIT News RSS, Hacker News RSS (latest page)
- Hacker News Firebase API (popular page)
- GitHub Trending (github page)

## Tech Stack

- Next.js 14 (App Router, API Routes)
- React 18 with TypeScript
- Tailwind CSS + Framer Motion (animations)
- NextAuth.js with GitHub OAuth
- date-fns for date formatting
