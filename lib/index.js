const jsonfile = require('jsonfile')

// Functions to be exported
// Set headers for identifying crawler
var HeaderOptions = {
  headers: {
    'User-Agent': 'NorchCrawlersBot/0.0.1 (+https://eklem.github.io/norch-crawlers/)',
    'from': 'espen.klem@gmail.com'
  }
}

// Play nice time expects millisecons
var PlayNice = function(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var RegexURL = function(url, regex) {
  let m;
  if ((m = regex.exec(url)) !== null) {
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        //console.log(`Found match, group ${groupIndex}: ${match}`);
    });
  }
  //console.dir(m[0])
  return parseInt(m[0])
}

var WriteJSON = function(urls, file, append) {
  console.log('End of crawling')
  console.log(urls)
  // create object with array as value
  let urlObj = {}
  urlObj["urls"] = urls
  if (append === true) {
    // Write to file all at once
    jsonfile.writeFile(file, urlObj, {flag:'a'}, function (err) {
      if (err) {
        console.error('error? ' + err)
      }
    })
  }
  else {
    // Append to file each time new element is found
    jsonfile.writeFile(file, urlObj, function (err) {
      if (err) {
        console.error('error? ' + err)
      }
    })

  }
}

// Export functions as norchcrawler:
// var norchcrawler = require('norch-crawlers')
//module.exports.crawlitem = CrawlItem;

module.exports.headerOptions = HeaderOptions;
module.exports.playNice = PlayNice;
module.exports.regexURL = RegexURL;
module.exports.writeJSON = WriteJSON;

