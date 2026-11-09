/**
 * Public Black Friday sale: 40% off all products with code BF40, for every
 * customer. Live on the Shopify store from November 9, 2026 at 2:05 PM ET
 * through November 30, 2026 at 11:59 PM ET.
 *
 * This replaces the public first-order code FIRST30 on the marketing site for
 * the sale window. Do not advertise FIRST30 while BF40 is the public offer.
 * EARLYAIRE50 is a private early-follower code and is never shown here.
 *
 * Every buy button goes through Shopify's /discount/<code> link, which stores
 * the code in the cart and auto-applies it at checkout. The window below
 * matches the Shopify schedule so the site stops advertising the code when
 * the sale ends and falls back to the regular product URL.
 */
export const SALE_CODE = 'BF40'
export const SALE_PERCENT = 40
/** November 9, 2026, 2:05 PM Eastern (EST, UTC−5). */
export const SALE_STARTS_AT = new Date('2026-11-09T14:05:00-05:00')
/**
 * Exclusive end: 12:00 AM ET on December 1, so the sale stays up through
 * 11:59:59 PM ET on November 30, 2026.
 */
export const SALE_ENDS_AT = new Date('2026-12-01T00:00:00-05:00')

export function saleActive(now: Date = new Date()): boolean {
  return now >= SALE_STARTS_AT && now < SALE_ENDS_AT
}

/** Product page with the sale code pre-applied. */
export const SALE_URL = `https://shop.airepouches.com/discount/${SALE_CODE}?redirect=/products/aire`
