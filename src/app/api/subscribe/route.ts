import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email, locale = 'en' } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Get Gmail credentials from environment variables
    const gmailEmail = process.env.GMAIL_EMAIL
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

    // For development/testing without credentials, simulate success
    if (!gmailEmail || !gmailAppPassword) {
      console.log('Newsletter subscription (mock):', email, locale)
      return NextResponse.json({
        success: true,
        message: locale === 'zh' ? '订阅成功！请查收确认邮件' : 'Subscribed! Please check your email.',
        mock: true,
        note: 'Configure GMAIL_EMAIL and GMAIL_APP_PASSWORD in Vercel to enable real emails'
      }, { status: 200 })
    }

    const isZh = locale === 'zh'
    const title = isZh ? '🎉 订阅成功！' : '🎉 Subscription Confirmed!'
    const greeting = isZh
      ? `感谢订阅！<strong>${email}</strong> 已加入邮件列表。`
      : `Thank you for subscribing! <strong>${email}</strong> added to newsletter.`
    const daily = isZh ? '每日 50+ 篇新闻' : '50+ Daily News'
    const realtime = isZh ? '24/7 实时更新' : '24/7 Real-time Updates'
    const readNow = isZh ? '立即阅读 →' : 'Read Now →'

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailAppPassword,
      },
    })

    // Send email
    await transporter.sendMail({
      from: `"AI News Daily" <${gmailEmail}>`,
      to: email,
      subject: title,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); border-radius: 12px; font-size: 24px; font-weight: bold; color: white;">
                🚀 AI News Daily
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 20px; padding: 32px; margin-bottom: 24px;">
              <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 16px 0; text-align: center;">
                ${title}
              </h1>
              
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                ${greeting}
              </p>
              
              <div style="display: flex; justify-content: center; gap: 32px; margin: 24px 0;">
                <div style="text-align: center;">
                  <div style="font-size: 28px; font-weight: bold; color: #818cf8;">50+</div>
                  <div style="font-size: 12px; color: #64748b;">${daily}</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 28px; font-weight: bold; color: #f472b6;">24/7</div>
                  <div style="font-size: 12px; color: #64748b;">${realtime}</div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://ai-news-bice.vercel.app" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">
                  ${readNow}
                </a>
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(100, 116, 139, 0.3);">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                © 2026 AI News Daily
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: isZh ? '订阅成功！请查收确认邮件' : 'Subscribed! Please check your email.',
    }, { status: 200 })
  } catch (error: any) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
