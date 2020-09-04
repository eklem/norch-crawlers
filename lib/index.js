const smta = require('sitemap-to-array')
const smtaOptions = {
  returnOnComplete: true
}
const jsonfile = require('jsonfile')

// const file = '/tmp/data.json'
// const obj = { name: 'JP' }

const CrawlSitemapURLs = function (sitemapUrl, filename) {
  smta(sitemapUrl, smtaOptions, (error, list) => {
    if (error) {
      console.error(error)
    } else {
      console.log(list)
      jsonfile.writeFile(filename, list, function (err) {
        if (err) console.error(err)
      })
    }
  })
}

// Export functions as nc:
// const nc = require('norch-crawlers')

module.exports.crawlSitemapURLs = CrawlSitemapURLs
