import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, locale = 'en' } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Skip actual email sending if no API key
    if (!process.env.RESEND_API_KEY) {
      console.log('Newsletter subscription (mock):', email, locale)
      return NextResponse.json({ 
        success: true, 
        message: locale === 'zh' ? '订阅成功！请查收确认邮件' : 'Subscribed! Please check your email.',
        mock: true
      }, { status: 200 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const isZh = locale === 'zh'
    const title = isZh ? '🎉 订阅成功！' : '🎉 Subscription Confirmed!'
    const greeting = isZh
      ? `感谢订阅！<strong>${email}</strong> 已加入邮件列表。`
      : `Thank you for subscribing! <strong>${email}</strong> added to newsletter.`
    const daily = isZh ? '每日 50+ 篇新闻' : '50+ Daily News'
    const realtime = isZh ? '24/7 实时更新' : '24/7 Real-time Updates'
    const readNow = isZh ? '立即阅读 →' : 'Read Now →'

    const data = await resend.emails.send({
      from: 'AI News Daily <newsletter@ai-news-bice.vercel.app>',
      to: email,
      subject: title,
      html: `
        <div style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 40px 20px; font-family: system-ui, sans-serif;">
          <div style="max-width: 500px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 28px;">🚀</span>
              <h1 style="color: white; margin: 12px 0 0;">AI News Daily</h1>
            </div>
            <div style="background: rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 24px; text-align: center;">
              <h2 style="color: white; margin: 0 0 16px; font-size: 20px;">${title}</h2>
              <p style="color: #94a3b8; margin: 0 0 20px;">${greeting}</p>
              <div style="display: flex; justify-content: center; gap: 24px; margin: 24px 0;">
                <div><div style="font-size: 24px; font-weight: bold; color: #818cf8;">50+</div><div style="font-size: 12px; color: #64748b;">${daily}</div></div>
                <div><div style="font-size: 24px; font-weight: bold; color: #f472b6;">24/7</div><div style="font-size: 12px; color: #64748b;">${realtime}</div></div>
              </div>
              <a href="https://ai-news-bice.vercel.app" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">${readNow}</a>
            </div>
            <p style="color: #475569; font-size: 12px; text-align: center; margin-top: 24px;">© 2026 AI News Daily</p>
          </div>
        </div>
      `,
    })

    if (data.error) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: isZh ? '订阅成功！请查收确认邮件' : 'Subscribed! Please check your email.',
    }, { status: 200 })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
