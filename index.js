'use strict'

const path = require('path')

const stringifyHtml = require('./lib/stringifyHtml')
const makeFilesObj = require('./lib/makeFilesObj')
const hashFilesObj = require('./lib/hashFilesObj')
const writeJsDL = require('./lib/writeJsDL')
const writeJsUL = require('./lib/writeJsUL')
const replaceHtml = require('./lib/replaceHtml')
const writeNewHtml = require('./lib/writeNewHtml')
const botGenerator = require(('./src/botGenerator'))

function WebFlight (options) {
  //🎈are we putting all this info on the window?
  Object.keys(options).forEach((key) => {
    this[key] = options[key]
  })

  let fileNamesArr = (() => {
    let fileArray = []
    for (let route in this.routes) {
      fileArray.push(path.basename(this.routes[route], '.html'))
    }
    return fileArray
  })() //['about']


  this.count = 0  // non-configurable
  this.fileNames = fileNamesArr  // non-configurable
  this.wfPath = options.wfPath ? options.wfPath : (__dirname + '/wfPath')  // default
  this.wfRoute = options.wfRoute ? options.wfRoute : ('/wfRoute')  // default


  this.seedScript = options.seedScript  // default
  ? options.seedScript
  : path.join(__dirname, 'wfPath/js/wf-seed.js')

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

  this.userCount = options.userCount ? options.userCount : 10  // default (redirect)
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

WebFlight.prototype.start = function () {
  //originalHtmlString is going to be holding a long html string
  //NOTE: stringifyHtml will be taking in either one path or an array of paths
  const originalHtmlString = stringifyHtml(this.originalHtml)

  //FILESFOLDER!!! is a path to a folder. What is FILESROUTE!!! (server routes). Files routes is either one path or an array of paths
  const filesObj = makeFilesObj(this.filesFolder, this.filesRoute) // -> //filesObj = {[serverRoute]+🎈(Q about '/' in between these two things)[fileName]:{fileOnServer:[absolutepath]+[fileName]},
                                                                  //                  '/images/kitten.jpg':{fileOnServer: 'projectName/images/kitten.jpg'},
                                                                  //                  '/images/puppy.jpg':{fileOnServer: 'projectName/images/puppy.jpg'}
                                                                  //
  hashFilesObj(filesObj)

  //this is a chain a promises. How does a chain of promises work? the next .then function gets called
  //only after the previous one has finished.
  //the function inside the .then is also passed and argument here, this is why we're doing a .bind.
  //The first arg in the .bind is null and the second argument inside .bind() is the FIRST argument that is passed
  //to the function being passed inside of .then.
  //for example the first .then() is being passed the fnuc writeJsDL an the the first arg being given to it
  //is jsOutputDL.
  //One more thing for this first function the other arg being passed to it is the return of hashFilesObj(filesObj) // -> which is the hashedObj.
  //So to conclude writeJsDL(this.jsOutputDL, hashedObj)
    .then(writeJsDL.bind(null, this.jsOutputDL))
    .then(writeJsUL.bind(null, this.jsOutputUL))
    .then(replaceHtml.bind(null, originalHtmlString, path.basename(this.jsOutputDL)))
    .then(writeNewHtml.bind(null, this.htmlOutput))
    .then(botGenerator.bind(null, this))
}


//the redirect function will live inside a watch function that we've not yet created.
//The watch function will be constantly watching/keeping count of  how many people have requested from the server.
//This count is being used in order to start the bots and then trigger the redirect once the bots are 'turned on' and seeding
WebFlight.prototype.redirect = function (req, res, next) {
  const destination = req.originalUrl

  if (destination === '/count.check.4wf') {
    res.send({count: this.count})
  }

  if (path.extname(destination) === '.html' || path.extname(destination) === '') {
    console.log(++this.count, 'entering')

    res.on('finish', () => {
      setTimeout(function () {
        console.log(--this.count, 'exiting')
      }.bind(this), 10000)
    }).on('close', () => {
      setTimeout(function () {
        console.log(--this.count, 'exiting')
      }.bind(this), 10000)
    })
  }

  if (destination === this.route || (!path.extname(req.originalUrl) && destination === path.basename(req.originalUrl))) {
    res.sendFile(this.htmlOutput)
  } else {
    next()
  }
}

module.exports = WebFlight
