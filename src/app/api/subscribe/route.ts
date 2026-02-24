import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const response = await fetch('https://a.klaviyo.com/client/subscriptions/?company_id=Xn33b3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'revision': '2023-12-15',
    },
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          list_id: 'RSt8aA',
          subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
          profile: { data: { type: 'profile', attributes: { email } } },
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Klaviyo error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
