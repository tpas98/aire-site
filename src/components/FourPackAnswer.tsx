'use client'
import { SALE_CODE, SALE_PERCENT, SALE_PACK_PRICE, LIST_PACK_PRICE } from '@/lib/sale'
import { useSaleActive } from '@/lib/useSale'

/**
 * FAQ answer for "How many pouches are in each can?". Sale-aware on the client
 * (same mechanism as SaleBanner), so the price copy flips back to the regular
 * price when the sale window closes without a redeploy.
 */
export default function FourPackAnswer() {
  const sale = useSaleActive()
  return sale ? (
    <>
      Each can of Aire contains 15 pouches. A 4-pack is ${SALE_PACK_PRICE} with code {SALE_CODE}, {SALE_PERCENT}% off for Black
      Friday (regularly ${LIST_PACK_PRICE}), and gives you 60 pouches total.
    </>
  ) : (
    <>Each can of Aire contains 15 pouches. A 4-pack (${LIST_PACK_PRICE}) gives you 60 pouches total.</>
  )
}
