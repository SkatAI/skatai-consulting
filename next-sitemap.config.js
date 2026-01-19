/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://skatai.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
}
