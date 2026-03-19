/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://alexisperrier.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
}
