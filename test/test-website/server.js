const express = require('express')
const app = express()

const path = require('path')

const WebFlight = require('../..')
app.set('view engine', 'ejs');
const wfObj = {
  siteUrl: 'http://localhost:3000',
  assetsPath: [path.join(__dirname, 'img'), path.join(__dirname, 'videos')],
  assetsRoute: ['bird-imgs/', 'bird-videos/', 'other-imgs/'],
  routes: {
    '/': path.join(__dirname, 'simple.ejs'),
    '/how.html': path.join(__dirname, 'how.html')
  }
}

const wf = new WebFlight(wfObj, __dirname)
console.log('🙏wf',wf)
wf.init()

app.use(wf.watch.bind(wf))

app.get('/', (req, res) => {
  console.log('🖖is this the rewritten', path.join(__dirname, '/wfPath/wf-simple.ejs'))
  res.render(path.join(__dirname, 'simple.ejs'))
})

app.get('/bird-imgs/:pic', (req, res) => {
  res.sendFile(path.join(__dirname, 'img', req.params.pic))
})

app.get('/other-imgs/:pic', (req, res) => {
  res.sendFile(path.join(__dirname, 'img', req.params.pic))
})

app.get('/bird-videos/:video', (req, res) => {
  res.sendFile(path.join(__dirname, 'videos', req.params.video))
})



app.listen(3000)
