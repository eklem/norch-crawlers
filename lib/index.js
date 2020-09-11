const fs = require('fs-extra')
let fsOptions = { spaces: 2 }
const fetch = require('node-fetch');
const parser = require('fast-xml-parser')
// const he = require('he') // Doesn't seem to be needing it for xml-to-json

// Some work needed
// Need to check if file already exist:
//   a: If it does - read file and crawl sitemap. For each object where lastmod is different, update lastmod. Add each element that didn't exist in the file. Write to file
//   b: If not, add a key/value lastcrawled: "" for each object and write JSON to file.
// So:
// * Check if file exists and read. Also set a fileExists = true (should be false by default)
// * If (fileExists) { update lastmod and add new to JSON. Remember to add empty lastcrawled-key to the ones added}
// * If (!fileExists) { add empty lastcrawled-key and add to JSON}
// * Write JSON to file
// Make a promise.all to continue when both fetch and fileExists has returned
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

// Promise.all waits until all jobs are resolved
const SitemapToFile = function (url, filename, options) {
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
  // With Promises: https://github.com/jprichardson/node-fs-extra/blob/master/docs/pathExists.md
  // Promise usage:
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
