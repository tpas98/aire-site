import { NextRequest, NextResponse } from 'next/server'

const KLAVIYO_COMPANY_ID = 'Xn33b3'
const KLAVIYO_REVISION = '2024-10-15'

// "Email List" — this is the list the live "Welcome Email — 10% Off" flow
// (WyccG7) triggers on. A signup MUST land here or no welcome email is sent.
const WELCOME_FLOW_LIST_ID = 'XAv474'

// "Email 10% signup" — segmentation only: who came in through the popup.
// No flow is attached to this list.
const POPUP_SOURCE_LIST_ID = 'RSt8aA'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Subscribing sends a real branded email to whatever address is posted, so the
// endpoint is rate limited per IP. This is in-process: it resets on cold start
// and is per-instance, which blunts bursts rather than stopping a distributed
// attack. Move to a shared store if abuse becomes a real problem.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_TRACKED_IPS = 5000

const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()

  if (hits.size > MAX_TRACKED_IPS) {
    const expired: string[] = []
    hits.forEach((value, key) => {
      if (value.resetAt <= now) expired.push(key)
    })
    expired.forEach((key) => hits.delete(key))
  }

  const entry = hits.get(ip)
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function subscribe(email: string, listId: string) {
  return fetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        revision: KLAVIYO_REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: { email },
              },
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId,
              },
            },
          },
        },
      }),
    }
  )
}

export async function POST(req: NextRequest) {
  let email: unknown
  let company: unknown
  try {
    ;({ email, company } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: the form ships a hidden "company" field that real people never
  // see. Anything that fills it is a bot. Answer as if it worked so the bot
  // has no signal to adapt to, but subscribe nobody.
  if (typeof company === 'string' && company.trim() !== '') {
    return NextResponse.json({ success: true })
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const address = email.trim().toLowerCase()

  // The flow list is the one that matters — it sends the 10% code.
  // The source list is best-effort bookkeeping and must not fail the request.
  const [flowRes, sourceRes] = await Promise.allSettled([
    subscribe(address, WELCOME_FLOW_LIST_ID),
    subscribe(address, POPUP_SOURCE_LIST_ID),
  ])

  if (sourceRes.status === 'rejected' || !sourceRes.value.ok) {
    console.error('Klaviyo: could not add to popup source list', POPUP_SOURCE_LIST_ID)
  }

  if (flowRes.status === 'rejected') {
    console.error('Klaviyo request failed:', flowRes.reason)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
  }

  if (!flowRes.value.ok) {
    console.error(
      'Klaviyo error:',
      flowRes.value.status,
      await flowRes.value.text()
    )
    return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
