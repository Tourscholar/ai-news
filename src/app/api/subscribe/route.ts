import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, locale = 'en' } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const isZh = locale === 'zh'
    const message = isZh 
      ? `订阅成功！${email} 已加入邮件列表（邮件功能待配置）` 
      : `Subscribed! ${email} added to newsletter (email pending configuration)`

    // Log subscription for now
    console.log('Newsletter subscription:', { email, locale, timestamp: new Date().toISOString() })

    // TODO: Integrate with email service (Gmail App Password, Resend with custom domain, or SendGrid)
    
    return NextResponse.json({
      success: true,
      message,
      note: 'Email sending pending configuration'
    }, { status: 200 })
  } catch (error: any) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
