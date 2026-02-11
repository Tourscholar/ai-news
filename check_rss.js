const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://ai-news-bice.vercel.app/subscribe');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // 等待动画完成
  
  // 滚动到页面底部
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/tmp/rss_check.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
