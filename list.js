// Libraries
const nc = require('./lib/index.js');
const request = require('request')
const cheerio = require('cheerio')
const jsonfile = require('jsonfile')

// Variables
let startURL = 'http://oppskrift.klikk.no/?fq=isSocial:false'
let urls = []
const file = 'wikipedia-urls.json'


crawlUrls(startURL, urls)

function crawlUrls(requestUrl, urls) {
  request(requestUrl, header.options, function (error, response, body) {
    if (error) {
      console.log('error:', error); // Print the error if one occurred 
    }
    
    let $ = cheerio.load(body)
    let nextPage = $('div.next a.fontQ.brandColor').attr('href')
