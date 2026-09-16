/**
 * Single source of truth for where a Buy / Shop Now button sends someone.
 *
 * Why this file exists: the URL used to be hardcoded in six components and drifted
 * to `drifts-7838.myshopify.com` — a foreign root domain. Browsers cannot carry a
 * cookie across it, so every ad click lost its attribution before checkout.
 *
 * Everything must stay on *.airepouches.com. That keeps one cookie root from the
 * landing page through checkout, which is what makes TikTok / Meta attribution work.
 */

/** Shopify product page — fires ViewContent and AddToCart before checkout. */
export const PRODUCT_URL = 'https://shop.airepouches.com/products/aire'

/**
 * Direct-to-checkout permalink. Faster, but skips ViewContent and AddToCart.
 *
 * The `skip_shop_pay=true` flag is load-bearing — do not drop it.
 *
 * A bare cart permalink triggers Shopify's Shop Pay *universal redirect*: the
 * 302 goes out to `shop.app/checkout/.../shoppay` before coming back here. For
 * a buyer who has ever used Shop Pay or the Shop app on that device, that hop
 * is not a fast bounce — shop.app renders an interstitial and tries to
 * authenticate them against Shop Pay before releasing them to the checkout.
 * That is the "checkout takes forever" complaint, and it is worst on mobile
 * Safari, where TikTok traffic lands.
 *
 * Measured 2026-09-15: without the flag, 2 redirects with an off-domain
 * shop.app hop in the middle; with it, 1 redirect straight to
 * shop.airepouches.com/checkouts/cn/<token>. Shop Pay is still offered as an
 * express button on the checkout page itself, so nothing is lost except the
 * automatic account-recognition attempt.
 *
 * Note the inverse flag `?payment=shop_pay` forces the shop.app hop — never
 * use it here.
 *
 * Keeping the flag also keeps the whole path on *.airepouches.com, which is
 * the cookie-root requirement described above.
 */
export const CART_URL =
  'https://shop.airepouches.com/cart/47952645161208:1?skip_shop_pay=true'

/**
 * What the buttons actually use.
 *
 * CART_URL — one click straight to checkout, which is the behaviour Aire wants and
 * the behaviour the site had before. The Shopify product page is still on an
 * unedited theme (placeholder "Collapsible Tab" sections, weak product photo), so
 * routing buyers through it would cost more conversion than the two extra pixel
 * events are worth.
 *
 * Switch to PRODUCT_URL only once that page has been properly built out — you'd
 * gain ViewContent and AddToCart, which are useful but not required: PageView,
 * ClickButton, InitiateCheckout and Purchase all still fire on this path.
 */
export const CHECKOUT_URL = CART_URL
