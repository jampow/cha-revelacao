const fs = require('fs')
const YAML = require('yaml')
const request = require('request')

const configFile = fs.readFileSync('./config.yaml', 'utf8')
const config = YAML.parse(configFile)

const download = function(uri, filename) {
  request.head(uri, function(err, resp, body) {
    request(uri).pipe(fs.createWriteStream(filename))
  })
}

// event url google chart
// https://chart.apis.google.com/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=BEGIN%3AVEVENT%0D%0ASUMMARY%3ATest%0D%0ADTSTART%3BVALUE%3DDATE%3A20120124%0D%0ADTEND%3BVALUE%3DDATE%3A20120125%0D%0AEND%3AVEVENT%0D%0A

const mountFields = data => Object.keys(data)
  .map(key => `${key.toUpperCase()}:${data[key]}`)

const eventTemplate = (data) => [
  'BEGIN:VEVENT',
  ...mountFields(data),
  'END:VEVENT`'
].map(encodeURIComponent)
.join('%0D%0A') // -> CRLF

//console.log('------------------------')
//console.log(mountFields(config.local))
//console.log(eventTemplate(config.local))
//console.log('------------------------')
//console.log(mountFields(config.virtual))
//console.log(eventTemplate(config.virtual))
//console.log('------------------------')

const googleApiAddress = 'https://chart.apis.google.com/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=' 

download(googleApiAddress + eventTemplate(config.local), './assets/local.png')
download(googleApiAddress + eventTemplate(config.virtual), './assets/virtual.png')

download(googleApiAddress + encodeURIComponent(config.youtube), './assets/youtube-live.png')
