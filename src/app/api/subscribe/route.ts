import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const response = await fetch(
    'https://drifts-7838.myshopify.com/admin/api/2024-01/customers.json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN!,
      },
      body: JSON.stringify({
        customer: {
          email,
          email_marketing_consent: {
            state: 'subscribed',
            opt_in_level: 'single_opt_in',
          },
          tags: 'popup-signup',
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
