'use strict'
const fs = require('fs')
const path = require('path')

/**
 * @param {string} dir
 */
function makeFilesObj (dir, route) {
  if (route.startsWith('/')) route = route.slice(1)
  if (!route.endsWith('/')) route += '/'

//fs.readdirSync takes in a path to folder (in our case the path is to the images folder) and creates/returns an
//array of array of filenames excluding '.' and '..'
  const filesArray = fs.readdirSync(dir) //['kitten.jpg', 'puppy.jpg']
  const filesObj = {}

//here's where the object is being constructed
//file = 'kitten.jpg'  &'puppy.jpg'
  filesArray.forEach((file) => {
    //the route here is a  SERVER ROUTE not a file path!
    filesObj[route + file] = {
      // Question: How will dir resolve and will I be able to use this path to find the file?
      fileOnServer: `${dir}/${file}`
    }
  })

  return filesObj //filesObj = {[serverRoute]+[fileName]:{fileOnServer:[absolutepath]+[fileName]},
                  //           '/images/kitten.jpg':{fileOnServer: 'projectName/images/kitten.jpg'},
                  //           '/images/puppy.jpg':{fileOnServer: 'projectName/images/puppy.jpg'}
                  //            }
}

module.exports = makeFilesObj
