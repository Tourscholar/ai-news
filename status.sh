#!/bin/bash

# AI News Daily - Deployment Status Check
# Run this to check if deployment is successful

set -e

echo "🔍 AI News Daily - Deployment Status"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DEPLOYMENT_URL="https://ai-news-bice.vercel.app"
API_URL="$DEPLOYMENT_URL/api/news"

echo ""
echo "Checking deployment at: $DEPLOYMENT_URL"
echo ""

# Check 1: Is the main page accessible?
echo "📄 Checking main page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Main page is accessible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Main page not accessible (HTTP $HTTP_CODE)${NC}"
    echo "  URL: $DEPLOYMENT_URL"
fi

# Check 2: Is the API responding?
echo ""
echo "🔌 Checking API..."
API_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" || echo "000")
if [ "$API_CODE" = "200" ]; then
    echo -e "${GREEN}✓ API is responding (HTTP $API_CODE)${NC}"
    
    # Check if it has data
    NEWS_COUNT=$(curl -s "$API_URL" | grep -o '"id"' | wc -l)
    if [ "$NEWS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ API returned $NEWS_COUNT news items${NC}"
    else
        echo -e "${YELLOW}⚠ API responded but no news items found${NC}"
    fi
else
    echo -e "${RED}✗ API not accessible (HTTP $API_CODE)${NC}"
    echo "  URL: $API_URL"
fi

# Check 3: Check build time
echo ""
echo "⏱️  Last checked: $(date)"

# Summary
echo ""
echo "======================================"
if [ "$HTTP_CODE" = "200" ] && [ "$API_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Deployment is HEALTHY!${NC}"
    echo ""
    echo "Your AI News Daily app is running at:"
    echo "  $DEPLOYMENT_URL"
    exit 0
else
    echo -e "${YELLOW}⚠️  Deployment may have issues${NC}"
    echo ""
    echo "If deployment just happened, wait a minute and try again."
    echo "Otherwise, check Vercel dashboard for errors:"
    echo "  https://vercel.com/tourscholar/ai-news/deployments"
    exit 1
fi
