// Libraries
const nc = require('./lib/index.js')

// Getting URLs
nc.sitemapToFile('https://www.oppskrift.no/sitemap-recipes.xml', './data/oppskrift.no.URLs.json')
// nc.crawlSitemapUrls('https://www.oppskrift.no/sitemap-ingredients.xml', './data/oppskrift.no.Ingredients.json')

// Getting content
