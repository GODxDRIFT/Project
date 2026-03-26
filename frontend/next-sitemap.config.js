/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://biziffy.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/pages/Profile',
    '/pages/mybusiness',
    '/pages/checkout',
    '/pages/verify-otp',
    '/pages/forgot-password',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/pages/Profile',
          '/pages/mybusiness',
          '/pages/checkout',
          '/pages/verify-otp',
          '/pages/forgot-password',
        ],
      },
    ],
  },
}
