// Libraries
const nc = require('./lib/index.js')

nc.crawlSitemapURLs('https://www.oppskrift.no/sitemap.xml', './data/oppskrift.no.URLs.json')

// const smta = require('sitemap-to-array')

// smta('https://www.oppskrift.no/sitemap.xml', stream => {
//   stream.on('error', error => {
//     console.error(error)
//   })
//   stream.on('data', data => {
//     console.log(data.toString())
//   })
// })
