import { NextResponse } from 'next/server'
import emailjs from '@emailjs/browser'

export async function POST(request: Request) {
  try {
    const { email, locale = 'en' } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const isZh = locale === 'zh'
    const title = isZh ? '🎉 订阅成功！' : '🎉 Subscription Confirmed!'
    const greeting = isZh
      ? `感谢订阅！<strong>${email}</strong> 已加入邮件列表。`
      : `Thank you for subscribing! <strong>${email}</strong> added to newsletter.`
    const daily = isZh ? '每日 50+ 篇新闻' : '50+ Daily News'
    const realtime = isZh ? '24/7 实时更新' : '24/7 Real-time Updates'
    const readNow = isZh ? '立即阅读 →' : 'Read Now →'

    // Send confirmation email
    const data = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || 'service_24w3zl9',
      process.env.EMAILJS_TEMPLATE_ID || 'template_6ioimfs',
      {
        to_email: email,
        subject: title,
        title,
        greeting,
        daily,
        realtime,
        read_now: readNow,
      },
      process.env.EMAILJS_PUBLIC_KEY || 'y_xjvGQrjRdYtmtGz'
    )

    return NextResponse.json({
      success: true,
      message: isZh ? '订阅成功！请查收确认邮件' : 'Subscribed! Please check your email.',
    }, { status: 200 })
  } catch (error: any) {
    console.error('EmailJS error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
