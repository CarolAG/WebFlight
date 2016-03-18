const express = require('express')
const app = express()

const path = require('path')
const WebFlight = require('../..')

const wfObj = {
  // originalHtml: path.join(__dirname, 'index.html'),
  // filesFolder: path.join(__dirname, 'img'),
  // filesRoute: 'img/',
  // jsOutputDL: path.join(__dirname, 'webflight.js'),
  // jsOutputUL: path.join(__dirname, 'wf/seedUL.js'),
  // htmlOutput: path.join(__dirname, 'wf/index.html'),
  routes: {'/':'sample.html'}
  // redirectTo: '/wf/'
}

// options :: Object
  // siteUrl: String            (required)
  // assetsPath: String|Array   (required)
  // assetsRoute: String|Array  (required)
  // routes: Object             (required)
  // userCount: Number          (optional - defaults to 10)
  // wfPath: String             (optional - defaults to '/wfPath')
  // wfRoute: String            (optional - defaults to '/wfRoute')
  // seedScript: String         (optional - defaults to 'wf-seed.js')

  //  siteUrl: ''
  //  assetsPath: ''/['', ''],
  //  assetsRoute: ''/['', ''],
  //  routes: {'/about.html': 'path/to/about.html'}
  //  userCount: 10
  //  wfPath: ''/Default(__dirname + '/wfPath'),
  //  wfRoute: ''/Default('/wfRoute'),
  //  seedScript: ''/Default('wf-seed.js'),


const wf = new WebFlight(wfObj)
console.log('wf', wf);
wf.start()

app.use(wf.redirect.bind(wf))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/img/*', (req, res) => {
  res.sendFile(__dirname + req.url)
})

app.get('/birdVid.ogv', (req, res) => {
  res.sendFile(__dirname + '/videos/birdVid.ogv')
})

app.get('/wf', (req, res) => {
  res.sendFile(__dirname + '/wf/index.html')
})

app.get('/webflight.js', (req, res) => {
  res.sendFile(__dirname + '/webflight.js')
})

app.listen(3000)
