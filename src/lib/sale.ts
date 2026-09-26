/**
 * End of Summer Sale — 15% off with code EOS15.
 *
 * The code is a Shopify discount (DiscountCodeNode 1574334202104): 15% off the
 * whole order, all buyers, unlimited uses, combines with the 10% / 15% pack
 * discounts and with free shipping. It expires at SALE_ENDS_AT, which must stay
 * equal to the Shopify discount's endsAt so the site never advertises a dead code.
 *
 * While the sale is live every buy button goes through Shopify's /discount/<code>
 * link, which stores the code in the cart and auto-applies it at checkout. The
 * home page revalidates hourly, so the banner and the links revert on their own
 * after the end date.
 */
export const SALE_CODE = 'EOS15'
export const SALE_PERCENT = 15
/** 2026-10-04 11:59:59 pm ET. */
export const SALE_ENDS_AT = new Date('2026-10-05T03:59:59Z')

export function saleActive(now: Date = new Date()): boolean {
  return now < SALE_ENDS_AT
}

/** Product page with the sale code pre-applied. */
export const SALE_URL = `https://shop.airepouches.com/discount/${SALE_CODE}?redirect=/products/aire`
