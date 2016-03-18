'use strict'

const fs = require('fs')
const path = require('path')

const stringifyHtmlFiles = require('./lib/stringifyHtmlFiles')
const makeFilesObj = require('./lib/makeFilesObj')
const hashFilesObj = require('./lib/hashFilesObj')
const writeJsUL = require('./lib/writeJsUL')
const replaceHtml = require('./lib/replaceHtml')
const writeNewHtml = require('./lib/writeNewHtml')
const botGenerator = require(('./src/botGenerator'))


function WebFlight (options, serverRoot) {
  Object.keys(options).forEach((key) => {
    this[key] = options[key]
  })


  let fileNamesArr = Object.keys(this.routes).map((file) => {
    return path.basename(this.routes[file], '.html')
  })


  this.count = 0  // non-configurable
  this.active = false // non-configurable
  this.fileNames = fileNamesArr // non-configurable

  this.wfPath = options.wfPath ? options.wfPath : path.join(serverRoot, '/wfPath')  // default

  // TODO: existsSync is deprecated, need alternative
  if (!fs.existsSync(this.wfPath)) {
    fs.mkdirSync(this.wfPath)
    fs.mkdirSync(path.join(this.wfPath, 'js'))
  }

  this.wfRoute = options.wfRoute ? options.wfRoute : ('/wfRoute')  // default


  this.seedScript = options.seedScript  // default
  ? options.seedScript
  : path.join(this.wfPath, 'js/wf-seed.js')

  this.jsOutputDL = (() => {  // non-configurable
    return fileNamesArr.map((file) => {
      return `${this.wfPath}/js/${file}-download.js`
    })
  })()

  this.htmlOutput = (() => {  // non-configurable
    return fileNamesArr.map((file) => {
      return `${this.wfPath}/wf-${file}.html`
    })
  })()

  this.userCount = options.userCount ? options.userCount : 5  // default (redirect)
  this.prepCount = Math.floor(this.userCount * 0.75)  // non-configurable (start bots)
  this.stopCount = Math.floor(this.userCount * 0.50)  // non-configurable (kill bots, redirect back)

  if (!this.siteUrl) console.error('Error: WebFlight options object requires "siteUrl" property')
  if (!this.assetsPath) console.error('Error: WebFlight options object requires "assetsPath" property')
  if (!this.assetsRoute) console.error('Error: WebFlight options object requires "assetsRoute" property')
  if (!this.routes) console.error('Error: WebFlight options object requires "routes" property')
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


WebFlight.prototype.init = function () {
  const htmlFiles = Object.keys(this.routes).map((route) => this.routes[route])
  const htmlStrings = stringifyHtmlFiles(htmlFiles)
  const filesObj = makeFilesObj(this.assetsPath, this.assetsRoute)

  hashFilesObj(filesObj)

    .then(writeJsUL.bind(null, this.seedScript, this.siteUrl, this.stopCount))
    .then(replaceHtml.bind(null, htmlStrings, htmlFiles))
    .then(writeNewHtml.bind(null, this.htmlOutput))
}


//the redirect function will live inside a watch function that we've not yet created.
//The watch function will be constantly watching/keeping count of  how many people have requested from the server.
//This count is being used in order to start the bots and then trigger the redirect once the bots are 'turned on' and seeding
WebFlight.prototype.redirect = function (req, res, next) {
  const destination = req.originalUrl
  if (this.routes[destination]) {
    res.sendFile(`/${this.wfPath}/wf-${path.basename(this.routes[destination])}`)
  } else {
    next()
  }
}

WebFlight.prototype.start = function () {
  botGenerator(this.seedScript)

  this.active = true
}

WebFlight.prototype.watch = function (req, res, next) {
  const destination = req.originalUrl

  if (path.extname(destination) === '.html' || path.extname(destination) === '') {
    console.log(++this.count, 'entering')

    setTimeout(function () { console.log(--this.count, 'exiting') }.bind(this), 10000)
  }
  if (destination === '/count.check.4wf') return res.send({count: this.count})
  if (destination === '/bots.no.longer.seeding.4wf') {
    this.active = false
    console.log('bots ending redirect')
  }
  if (!this.active && this.count > this.prepCount) this.start()
  if (this.count > this.userCount) return this.redirect(req, res, next)

  next()
}

module.exports = WebFlight
