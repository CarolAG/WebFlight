'use strict'

const createTorrent = require('create-torrent')
const parseTorrent = require('parse-torrent')

function hashFilesObj (filesObj) {
<<<<<<< HEAD
  //filesObj = {'/images/cats': {'fileOnServer': 'projectName/imgs/kitten.jpg'},
  //            '/images/dog': {'fileOnServer': 'projectName/imgs/puppy.jpg'}
  //           }
  return new Promise((resolve, reject) => {
    const hashObj = filesObj
    const filesArray = Object.keys(filesObj) //['/images/cats.jpg','/images/dog.jpg']
=======
  return new Promise((resolve, reject) => {
    const hashObj = filesObj
    const filesArray = Object.keys(filesObj)
>>>>>>> 52c1b59acebfaf021f0f1a71fdc7de3535d0b5e1

    const filesSrcArray = Object.keys(filesObj).map((file) => {
<<<<<<< HEAD
      //what is fileOnServer: the img/vid file?
      // var hashObj = {'/images/cats': {'fileOnServer': 'projectName/imgs/kitten.jpg'},
      //                 '/images/dog': {'fileOnServer': 'projectName/imgs/puppy.jpg'}
      //               }
      return filesObj[file].fileOnServer //'projectName/imgs/kitten.jpg'
    }) //filesSrcArray = ['projectName/imgs/kitten.jpg', 'projectName/imgs/puppy.jpg']

    hashFile(filesSrcArray)

//🎈 We're changing from es6 format for functions back to es5
    function hashFile (array) {
      const fileSrc = array.pop() //'projectName/imgs/kitten.jpg'
      const file = filesArray.pop() // '/images/dog'
=======
      return filesObj[file].fileOnServer
    })

    hashFile(filesSrcArray)


    function hashFile (array) {
      const fileSrc = array.pop()
      const file = filesArray.pop()
>>>>>>> 52c1b59acebfaf021f0f1a71fdc7de3535d0b5e1

      createTorrent(fileSrc, (err, torrent) => {
        if (err) {
          reject(err)
          throw err
        }
        const tor = parseTorrent(torrent)
        const hash = tor.infoHash
        const filename = tor.files[0].name
        const trackers = tor.announce.map((tracker) => {
          return `tr=${tracker}`
        }).join('&')

        let magnetURI = `magnet:?xt=urn:btih:${hash}&dn=${filename}&${trackers}`

        hashObj[file].hash = hash
        hashObj[file].magnet = magnetURI

        if (array.length) {
          hashFile(array)
        } else {
          resolve(hashObj)
        }
      })
    }
  })
}

module.exports = hashFilesObj
