/**
 * New customer offer: 30% off a first order with code FIRST30.
 *
 * The code is a Shopify discount (DiscountCodeNode 1575912898808): 30% off the
 * whole order, one use per customer, no end date. It does not combine with the
 * 10% / 15% pack discounts (the better deal wins); it does combine with free
 * shipping. Replaced the End of Summer Sale (EOS15) on 2026-10-01.
 *
 * Every buy button goes through Shopify's /discount/<code> link, which stores
 * the code in the cart and auto-applies it at checkout. If the discount is ever
 * given an end date, set SALE_ENDS_AT to the same time so the site never
 * advertises a dead code.
 */
export const SALE_CODE = 'FIRST30'
export const SALE_PERCENT = 30
/** No end date; far in the future so saleActive() stays true. */
export const SALE_ENDS_AT = new Date('2099-12-31T23:59:59Z')

export function saleActive(now: Date = new Date()): boolean {
  return now < SALE_ENDS_AT
}

/** Product page with the sale code pre-applied. */
export const SALE_URL = `https://shop.airepouches.com/discount/${SALE_CODE}?redirect=/products/aire`
