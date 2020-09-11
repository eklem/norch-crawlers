const fs = require('fs-extra')
let fsOptions = { spaces: 2 } // needs to be re-done to be a generic option object
const fetch = require('node-fetch')
const parser = require('fast-xml-parser')
// const {cheerio, ehp, lvm, ngraminator, sw, wnn} = require('daq-proc')

// Promise.all waits until all jobs are resolved
const SitemapToFile = function (url, filename, options) {
  // needs to be re-done to be a generic option object
  // One extra thing needed is { fullRecrawl: false } set to default, and then you can pass { fullRecrawl: true } to trigger a full recrawl.
  fsOptions = {
    ...fsOptions,
    ...options
  }
  Promise.all([CrawlSitemap(url), CheckIfFileExists(filename)])
    .then(data => {
      const urls = data[0].urlset.url.map(object => ({ ...object, lastcrawled: '' }))
      console.log(urls)
      const fileExists = data[1].fileExists
      if (!fileExists) {
        fs.outputJson(filename, urls, fsOptions)
      } else {
        readJson(filename)
          .then(fileContent => {
            const newUrls = urls.map(function (object) {
              object = UpdateCrawled(object, fileContent)
              return object
            })
            // console.log(newUrls)
            fs.writeJson(filename, newUrls, fsOptions)
          })
      }
    })
    .catch(error => {
      console.log('Error in SitemapToFile: ' + error)
    })
}

const UpdateCrawled = function (crawledObject, fileArray) {
  try {
    const fileObject = fileArray.find(object => object.loc === crawledObject.loc)
    if (crawledObject.lastcrawled !== fileObject.lastcrawled) {
      crawledObject.lastcrawled = fileObject.lastcrawled
      return crawledObject
    } else {
      throw new Error('lastcrawled === fileObject.lastcrawled')
    }
  } catch (err) {
    // console.log('Error in UpdateCrawled: ' + err)
    return crawledObject
  }
}

const CrawlSitemap = function (url) {
  return fetch(url)
    .then(response => response.text())
    .then(xmlData => {
      const jsonData = parser.parse(xmlData)
      // console.log(JSON.stringify(jsonData))
      return jsonData
    })
    .catch(error => {
      console.log('Error in CrawlSitemapUrls: ' + error)
    })
}

const CheckIfFileExists = function (filename) {
  return fs.pathExists(filename)
    .then(trueFalse => {
      const fileExists = trueFalse // => true/false
      // console.log('File exists in function: ' + trueFalse)
      return { fileExists: fileExists }
    })
    .catch(error => {
      console.log('Error in CheckIfFileExists: ' + error)
    })
}

const readJson = function (filename) {
  return fs.readJson(filename)
    .then(fileContent => {
      return fileContent
    })
    .catch(err => {
      console.error(err)
    })
}

const ReadUrlsToCrawl = function (contentUrlsFile) {
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
module.exports.sitemapToFile = SitemapToFile
module.exports.crawlSitemap = CrawlSitemap
module.exports.checkIfFileExists = CheckIfFileExists
module.exports.readUrlsToCrawl = ReadUrlsToCrawl
module.exports.crawlContent = CrawlContent
module.exports.writeContent = WriteContent
module.exports.updateSitemapUrls = UpdateSitemapUrls
