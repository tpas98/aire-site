/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Canonical host is the apex. NOTE: if Vercel is already redirecting
      // www -> apex at the domain level (Project > Settings > Domains), that
      // rule runs at the edge BEFORE this one and this is a no-op. Set the
      // Vercel-level redirect to permanent (308) there.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.airepouches.com' }],
        destination: 'https://airepouches.com/:path*',
        permanent: true,
      },
      // The comparison page was removed 2026-09-22 (brand rule: never name a competitor).
      // Old links and search results go straight to the product page.
      {
        source: '/compare/:path*',
        destination: 'https://shop.airepouches.com/products/aire',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/agents.md',
        headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }],
      },
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ]
  },
}

module.exports = nextConfig
