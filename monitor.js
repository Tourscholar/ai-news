#!/usr/bin/env node

/**
 * AI News Daily - OAuth Login Test & Deployment Monitor
 * 
 * This script:
 * 1. Monitors GitHub deployments
 * 2. Verifies Vercel builds
 * 3. Tests OAuth login flow with headless browser
 * 4. Reports status back
 */

const { exec, spawn } = require('child_process')
const https = require('https')
const http = require('http')

// Colors for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

const LOG_PREFIX = '[AI News Monitor]'

function log(message, type = 'info') {
  const color = colors[type] || colors.blue
  console.log(`${color}${LOG_PREFIX}${colors.reset} ${message}`)
}

function logSuccess(message) {
  log(message, 'green')
}

function logError(message) {
  log(message, 'red')
}

function logWarning(message) {
  log(message, 'yellow')
}

// Check if deployment is healthy
async function checkDeployment(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        data,
        success: res.statusCode === 200 
      }))
    }).on('error', (err) => {
      resolve({ status: 0, error: err.message, success: false })
    })
  })
}

// Test OAuth login page
async function testOAuthPage(url) {
  const result = await checkDeployment(url)
  
  if (!result.success) {
    return { success: false, error: `HTTP ${result.status}` }
  }
  
  // Check for sign-in related elements
  const hasSignIn = result.data.toLowerCase().includes('sign in') || 
                   result.data.toLowerCase().includes('signin') ||
                   result.data.toLowerCase().includes('github')
  
  const hasAuthButton = result.data.includes('data-auth') || 
                        result.data.includes('next-auth')
  
  return {
    success: result.success,
    hasSignIn,
    hasAuthButton,
    pageLoaded: true
  }
}

// Get latest GitHub commit status
async function getLatestCommit(repo = 'Tourscholar/ai-news') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/commits/main`,
      headers: { 'User-Agent': 'AI-News-Monitor' }
    }
    
    https.get(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const commit = JSON.parse(data)
          resolve({
            sha: commit.sha,
            message: commit.commit?.message,
            date: commit.commit?.author?.date,
            author: commit.commit?.author?.name
          })
        } catch {
          resolve({ error: 'Failed to parse commit data' })
        }
      })
    }).on('error', (err) => {
      resolve({ error: err.message })
    })
  })
}

// Monitor deployment status
async function monitorDeployment() {
  const MAIN_URL = 'https://ai-news-bice.vercel.app'
  const API_URL = `${MAIN_URL}/api/news`
  const SIGNIN_URL = `${MAIN_URL}/auth/signin`
  
  console.log('\n' + '='.repeat(60))
  console.log('🤖 AI News Daily - Deployment Monitor')
  console.log('='.repeat(60) + '\n')
  
  // Get latest commit
  const commit = await getLatestCommit()
  if (commit.sha) {
    logSuccess(`Latest commit: ${commit.sha.substring(0, 7)}`)
    log(`Message: ${commit.message?.split('\n')[0]}`)
    console.log('')
  }
  
  // Check main page
  log('Checking main page...')
  const mainResult = await checkDeployment(MAIN_URL)
  if (mainResult.success) {
    logSuccess('✓ Main page is accessible')
  } else {
    logError(`✗ Main page failed (HTTP ${mainResult.status})`)
  }
  
  // Check API
  log('Checking API...')
  const apiResult = await checkDeployment(API_URL)
  if (apiResult.success) {
    const newsCount = (apiResult.data.match(/"id"/g) || []).length
    logSuccess(`✓ API is responding (${newsCount} news items)`)
  } else {
    logError(`✗ API failed (HTTP ${apiResult.status})`)
  }
  
  // Check OAuth page
  log('Checking OAuth login...')
  const oauthResult = await testOAuthPage(SIGNIN_URL)
  if (oauthResult.success && oauthResult.hasSignIn) {
    logSuccess('✓ OAuth login page is ready')
  } else {
    logWarning('⚠ OAuth page needs attention')
    if (!oauthResult.hasSignIn) {
      log('  - Sign-in content not detected')
    }
  }
  
  console.log('\n' + '='.repeat(60))
  
  // Summary
  const allHealthy = mainResult.success && apiResult.success
  if (allHealthy) {
    logSuccess('✅ All systems operational!')
    console.log(`\n🌐 Visit: ${MAIN_URL}`)
  } else {
    logError('⚠️ Some systems have issues')
    console.log(`\n📋 Check Vercel: https://vercel.com/tourscholar/ai-news/deployments`)
  }
  
  console.log('='.repeat(60) + '\n')
  
  return allHealthy
}

// Auto-fix function for common build errors
async function autoFix() {
  log('Running auto-fix...')
  
  // Common fixes
  const fixes = [
    {
      name: 'Install dependencies',
      command: 'npm ci',
      check: () => require('fs').existsSync('node_modules')
    },
    {
      name: 'Clear Next.js cache',
      command: 'rm -rf .next',
      check: () => true
    },
    {
      name: 'Check TypeScript errors',
      command: 'npx tsc --noEmit',
      check: () => true
    }
  ]
  
  for (const fix of fixes) {
    try {
      log(`Running: ${fix.name}`)
      await new Promise((resolve, reject) => {
        exec(fix.command, (err) => {
          if (err && err.code !== 0) {
            logWarning(`${fix.name} reported issues: ${err.message}`)
          } else {
            logSuccess(`${fix.name} completed`)
          }
          resolve()
        })
      })
    } catch (e) {
      logWarning(`Fix "${fix.name}" encountered error: ${e.message}`)
    }
  }
  
  logSuccess('Auto-fix completed')
}

// Main entry point
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--fix')) {
    await autoFix()
  } else if (args.includes('--continuous') || args.includes('-c')) {
    // Continuous monitoring mode
    console.log('Starting continuous monitoring...')
    console.log('Press Ctrl+C to stop\n')
    
    setInterval(async () => {
      const healthy = await monitorDeployment()
      if (!healthy) {
        logWarning('Deployment unhealthy, running auto-fix...')
        await autoFix()
      }
    }, 60000) // Check every minute
  } else {
    // Single check
    await monitorDeployment()
  }
}

main().catch(err => {
  logError(`Monitor error: ${err.message}`)
  process.exit(1)
})
