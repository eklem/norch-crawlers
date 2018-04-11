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
      console.log('error:', error); // Print the error if one occurred 
    }
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    //console.log('body:', body); // Print the HTML for the Google homepage. 
    
    let $ = cheerio.load(body)
    $('div.recipes div.recipe-item .text a').each(function (index, element) {
      urls.push($(element).attr('href'))
    })

    let nextPage = $('div.next a.fontQ.brandColor').attr('href')
    let lastPage = $('div.next a.btnLast').attr('href')
    console.log('lastPage: ' + lastPage + '\nnextPage: ' + nextPage)
    let nextPageNumber = nc.regexURL(nextPage, /\d+/)
    let lastPageNumber = nc.regexURL(lastPage, /\d+/)
    if (nextPageNumber < lastPageNumber) {
      nc.playNice(2000).then(() => {
        crawlUrls(nextPage, urls)
      });
    }
    // Check if last page, write and exit
    if (nextPageNumber === lastPageNumber || nextPageNumber > lastPageNumber) {
      nc.writeAllOnce(urls, file)
    }
  })
}
