const fs = require('fs-extra')
const fetch = require('node-fetch');
const parser = require('fast-xml-parser')
const url = 'https://www.oppskrift.no/sitemap.xml'
const filename = './data/oppskrift.no.URLs.json'

// map every url to the promise of the fetch
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
    .then(data => {
      return data
    })
    .catch(error => {
      console.log('Error in CheckIfFileExists: ' + error)
    })
}

// Promise.all waits until all jobs are resolved
Promise.all([CrawlSitemap(url), CheckIfFileExists(filename)])
  .then((values) => {
    console.log(JSON.stringify(values))
  })
  .catch(error => {
    console.log('Error in Promise.all: ' + error)
  })
