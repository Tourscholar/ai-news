/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/news',
        destination: 'https://www.theverge.com/ai-artificial-intelligence',
      },
    ]
  },
}

module.exports = nextConfig
