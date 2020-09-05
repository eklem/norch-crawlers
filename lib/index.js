const fs = require('fs-extra')
const fsOptions = {spaces: 2}
const fetch = require('node-fetch');
const parser = require('fast-xml-parser')
// const he = require('he') // Doesn't seem to be needing it for xml-to-json

const CrawlSitemapURLs = function (sitemapUrl, filename) {
  // Some work needed
  // Need to check if file already exist:
  //   a: If it does - read file and crawl sitemap. For each object where lastmod is different, update lastmod. Add each element that didn't exist in the file. Write to file
  //   b: If not, add a key/value lastcrawled: "" for each object and write JSON to file.
  // So:
  // * Check if file exists and read. Also set a fileExists = true (should be false by default)
  // * If (fileExists) { update lastmod and add new to JSON. Remember to add empty lastcrawled-key to the ones added}
  // * If (!fileExists) { add empty lastcrawled-key and add to JSON}
  // * Write JSON to file
  console.log('hello ' + sitemapUrl + ' ' + filename)
  fetch(sitemapUrl)
    .then(response => response.text())
    .then(xmlData => {
      console.log(JSON.stringify(parser.parse(xmlData), null, 2))
      const jsonData = parser.parse(xmlData)
      // With Promises:
      fs.writeJson(filename, jsonData, fsOptions)
        .then(() => {
          console.log('success!')
        })
        .catch(err => {
          console.error(err)
        })
    })
}

const UrlsToCrawl = function (contentUrlsFile) {
  // Read URL file
  // Check each object if (lastmod !== lastcrawled) (delta from previous content crawl)
  // push to crawl array
}

const CrawlContent = function (contentURLs) {
  // promise based function, crawling one URL at a time and then addding:
  //   .then-step for i.e. document processing
  //   .then-step for i.e. WriteContent to file or pushing to a search engine / cloud service
  //   .then-step for updating URL file setting all lastcrawled = lastmod
}

const WriteContent = function () {
  // creates file / updates file / pushes new content to file
}

const UpdateSitemapUrls = function () {
  // take JSON from sitemapURL file and update all URLs crawled with lastcrawled = lastmod
}

// Export functions as nc:
module.exports.crawlSitemapURLs = CrawlSitemapURLs
module.exports.urlsToCrawl = UrlsToCrawl
module.exports.crawlContent = CrawlContent
module.exports.writeContent = WriteContent
module.exports.updateSitemapUrls = UpdateSitemapUrls
