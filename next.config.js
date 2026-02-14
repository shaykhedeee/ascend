/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  
  // Production-grade security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://js.puter.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.groq.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.aimlapi.com https://js.puter.com https://api.stripe.com https://*.clerk.accounts.dev https://spotted-akita-320.eu-west-1.convex.cloud wss://spotted-akita-320.eu-west-1.convex.cloud wss:",
              "frame-src 'self' https://js.stripe.com https://*.clerk.accounts.dev",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Compression and performance
  compress: true,
  
  // PWA configuration
  poweredByHeader: false,
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', '@/components', '@/lib'],
  },
}

module.exports = nextConfig
