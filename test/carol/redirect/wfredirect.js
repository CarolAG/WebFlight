module.exports = { redirect: function (req, res, next) {
    var destination = req.originalUrl
    console.log('global', global.routes);
    if (destination === '/') {
      return 'redirect.html'
      //res.sendFile(`/${this.wfPath}/wf-${path.basename(this.routes[destination])}`)
    } else {
      return 'index.html'
      //next()
    }
  }
}
