// Libraries
const nc = require('./lib/index.js');
const request = require('request')
const cheerio = require('cheerio')


// Variables
let startURL = 'http://oppskrift.klikk.no/?fq=isSocial:false&start=6060'
let urls = []
const file = 'test-urls.json'

crawlUrls(startURL, urls)

function crawlUrls(requestUrl, urls) {
  request(requestUrl, nc.headerOptions, function (error, response, body) {
    if (error) {
      console.log('error:', error);
    }
    console.log('statusCode:', response && response.statusCode); 

    // Get content and push to array urls[]
    let $ = cheerio.load(body)
    $('div.recipes div.recipe-item .text a').each(function (index, element) {
      urls.push($(element).attr('href'))
    })

    // Figure out nextPage and lastPage URL + number
    let nextPage = $('div.next a.fontQ.brandColor').attr('href')
    let lastPage = $('div.next a.btnLast').attr('href')
    console.log('lastPage: ' + lastPage + '\nnextPage: ' + nextPage + '\nURLs crawled: ' + urls.length)

    // Check if more to crawl
    if (nextPage !== lastPage) {
      nc.playNice(2000).then(() => {
        crawlUrls(nextPage, urls)
      });
    }

    // Check if last page, write and exit
    if (nextPage === lastPage) {
      nc.writeJSON(urls, file)
    }
  })
}
