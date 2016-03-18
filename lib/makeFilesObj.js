'use strict'
const fs = require('fs')
const path = require('path')

/**
 * @param {string} | {array} dir - absolute path to directory (or directories) containing content to be seeded
 * @param {string} | {array} route - route (or routes) on the site that will have seeded content
 */
function makeFilesObj (dir, route) {
  // TODO: handle edge cases, make errors
  const returnObject = {}
  // build from collection of directories
  if (Array.isArray(dir)) {
    var filesArray = []
    dir.forEach((folder) => {
      // TODO: refactor for fs.readdir
      let files = fs.readdirSync(folder)
      filesArray = filesArray.concat(files.map((file) => `${folder}/${file}`))
    })

<<<<<<< HEAD
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
=======
    // check for collection of routes
    if (Array.isArray(route)) {
      let routesArr = route.map((r) => {
        // each route r in array should conform to the pattern 'route/name/'
        if (r.startsWith('/')) r = r.slice(1)
        if (!r.endsWith('/')) r += '/'
        return r
      })

      routesArr.forEach((route) => {
        filesArray.forEach((file) => {
          returnObject[route + path.basename(file)] = {
            fileOnServer: `${file}`
          }
        })
      })
      return returnObject
    } else {
      // route is single string
      if (route.startsWith('/')) route = route.slice(1)
      if (!route.endsWith('/')) route += '/'

      filesArray.forEach((file) => {
        returnObject[route + path.basename(file)] = {
          fileOnServer: file
        }
      })
      return returnObject
>>>>>>> 6707eb13df5f736e2d16048ea49407fb8da241a5
    }
  } else {
    let filesArray = fs.readdirSync(dir)

    // dir is single path, route is a collection of routesArr
    if (Array.isArray(route)) {
      let routesArr = route.map((r) => {
        // each route r in array should conform to the pattern 'route/name/'
        if (r.startsWith('/')) r = r.slice(1)
        if (!r.endsWith('/')) r += '/'
        return r
      })

      routesArr.forEach((r) => {
        filesArray.forEach((file) => {
          returnObject[r + file] = {
            fileOnServer: `${dir}/${file}`
          }
        })
      })
      return returnObject
    } else {
      // both dir and route are strings
      if (route.startsWith('/')) route = route.slice(1)
      if (!route.endsWith('/')) route += '/'

<<<<<<< HEAD
  return filesObj //filesObj = {[serverRoute]+[fileName]:{fileOnServer:[absolutepath]+[fileName]},
                  //           '/images/kitten.jpg':{fileOnServer: 'projectName/images/kitten.jpg'},
                  //           '/images/puppy.jpg':{fileOnServer: 'projectName/images/puppy.jpg'}
                  //            }
=======
      filesArray.forEach((file) => {
        returnObject[route + file] = {
          fileOnServer: `${dir}/${file}`
        }
      })
      return returnObject
    }
  }
>>>>>>> 6707eb13df5f736e2d16048ea49407fb8da241a5
}

module.exports = makeFilesObj

