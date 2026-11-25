# AI News Daily

每日 AI 要闻聚合 Web 应用。

## 功能

- 📰 聚合多个 AI 新闻源（Google News RSS）
- 🏷️ 分类筛选（行业动态、AI应用、政策安全等）
- 🔄 每 30 分钟自动更新 + 手动刷新
- 👤 GitHub OAuth 登录
- 📱 响应式设计（移动端适配）
- ✨ 极客风格 UI（星空、粒子、霓虹特效）

## 快速开始

```bash
cd /Users/tourscholar/Documents/Agent/ai-news

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 环境配置

复制环境变量模板并配置：

```bash
cp .env.example .env.local
```

需要配置以下环境变量：

### GitHub OAuth
1. 打开 https://github.com/settings/developers
2. New OAuth App
3. 设置：
   - Application name: AI News Daily
   - Homepage URL: http://localhost:3000
   - Callback URL: http://localhost:3000/api/auth/callback/github
4. 复制 Client ID 和 Client Secret 到 `.env.local`

### Vercel 部署
部署时在 Vercel Dashboard 的 Environment Variables 中添加以下变量

## 新闻源

- Google News RSS (实时更新)

## 技术栈

- **框架**: Next.js 16 (App Router)
- **认证**: NextAuth.js (GitHub)
- **样式**: Tailwind CSS + Framer Motion
- **部署**: Vercel + GitHub Actions

## 访问

开发环境: http://localhost:3000
生产环境: https://ai-news-bice.vercel.app

## 自动化脚本

- `setup.sh` - 一键配置 Vercel 部署
- `status.sh` - 检查部署状态
- `.github/workflows/deploy.yml` - 自动构建部署
