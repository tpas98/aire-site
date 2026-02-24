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
      'revision': '2024-10-15',
    },
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: 'SUBSCRIBED',
                      consented_at: new Date().toISOString(),
                    },
                  },
                },
              },
            },
          },
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: 'RSt8aA',
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Klaviyo error:', errorText)
    return NextResponse.json({ error: errorText }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
