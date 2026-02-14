// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Robots.txt Configuration
// SEO-optimized robots configuration for Next.js
// ═══════════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ascend.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Protect API routes
          '/private/',       // Private pages
          '/_next/',         // Next.js internals
          '/admin/',         // Admin pages if any
          '/*.json$',        // Protect JSON files except manifest
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      // Block aggressive crawlers
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
