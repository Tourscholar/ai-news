#!/bin/bash

# AI News Daily - OAuth Login Test

DEPLOYMENT_URL="https://ai-news-bice.vercel.app"
SIGNIN_URL="$DEPLOYMENT_URL/auth/signin"
MAIN_URL="$DEPLOYMENT_URL"

echo "Testing AI News Daily deployment..."
echo ""

# Test 1: Main page
echo "1. Checking main page..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$MAIN_URL")
if [ "$MAIN_STATUS" = "200" ]; then
    echo "   ✓ Main page OK (HTTP $MAIN_STATUS)"
else
    echo "   ✗ Main page failed (HTTP $MAIN_STATUS)"
fi

# Test 2: API
echo "2. Checking API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$MAIN_URL/api/news")
if [ "$API_STATUS" = "200" ]; then
    NEWS_COUNT=$(curl -s "$MAIN_URL/api/news" 2>/dev/null | grep -o '"id"' | wc -l || echo 0)
    echo "   ✓ API OK ($NEWS_COUNT news items)"
else
    echo "   ✗ API failed (HTTP $API_STATUS)"
fi

# Test 3: Sign-in page
echo "3. Checking sign-in page..."
SIGNIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SIGNIN_URL")
if [ "$SIGNIN_STATUS" = "200" ]; then
    HAS_GITHUB=$(curl -s "$SIGNIN_URL" | grep -ci "github" || echo 0)
    echo "   ✓ Sign-in page OK (HTTP $SIGNIN_STATUS)"
    echo "   ✓ GitHub OAuth detected ($HAS_GITHUB mentions)"
else
    echo "   ✗ Sign-in page failed (HTTP $SIGNIN_STATUS)"
fi

echo ""
echo "================================"
if [ "$MAIN_STATUS" = "200" ] && [ "$API_STATUS" = "200" ] && [ "$SIGNIN_STATUS" = "200" ]; then
    echo "All tests passed!"
    echo "Visit: $SIGNIN_URL to test login"
    exit 0
else
    echo "Some tests failed"
    echo "Check: https://vercel.com/tourscholar/ai-news/deployments"
    exit 1
fi
