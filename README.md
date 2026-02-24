# Aire — Next.js Site

Built with **Next.js 14 + Tailwind CSS + Framer Motion**

---

## 🚀 Deploy to Vercel (3 minutes)

### Option A — GitHub (recommended, free CI/CD)
1. Create a free account at github.com
2. Create a new repository called `aire-site`
3. Upload all these files to it
4. Go to vercel.com → "Add New Project" → Import from GitHub
5. Select your repo → click **Deploy**
6. Done. You'll get a live URL like `aire-site.vercel.app`

### Option B — Direct drag & drop
1. Go to vercel.com and create a free account
2. Click "Add New Project" → "Deploy without Git"
3. Drag this entire `aire-site` folder into the upload area
4. Click **Deploy**
5. Done ✓

---

## 💻 Run locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 🛒 Connect to Shopify (when ready)

1. In your Shopify admin → Settings → Apps → Storefront API
2. Create a private app, enable Storefront API
3. Install: `npm install @shopify/hydrogen-react`
4. Add your store credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token
   ```
5. Replace the `href="#shop"` buttons with real Shopify cart/checkout links

---

## 📁 Project structure

```
aire-site/
├── public/
│   ├── images/          ← All product & lifestyle images
│   └── video/           ← Hero background video (MP4 + WebM)
├── src/
│   ├── app/
│   │   ├── layout.tsx   ← Root layout + metadata/SEO
│   │   ├── page.tsx     ← Main page (assembles all sections)
│   │   └── globals.css  ← Tailwind + Google Fonts
│   └── components/
│       ├── Navbar.tsx        ← Fixed nav with Framer Motion entry
│       ├── Ticker.tsx        ← Scrolling ingredient ticker
│       ├── Hero.tsx          ← Video hero + floating can animation
│       ├── FadeUp.tsx        ← Reusable scroll animation wrapper
│       ├── LifestyleStrip.tsx
│       ├── About.tsx
│       ├── Ingredients.tsx
│       ├── ProductFeature.tsx ← Also contains How It Works + Comparison
│       ├── Testimonials.tsx
│       └── CTAFooter.tsx
```

---

## ✅ Before launch checklist

- [ ] Replace placeholder testimonials with real customer quotes
- [ ] Add your Instagram + X (Twitter) profile URLs in CTAFooter.tsx
- [ ] Connect Shopify (see above)
- [ ] Add your domain (airepouches.com) in Vercel → Settings → Domains
- [ ] Generate a new Gemini hero video at higher resolution if possible
- [ ] Add FAQ, About, Science, Shipping pages
- [ ] Install Recharge or Skio for subscription support
