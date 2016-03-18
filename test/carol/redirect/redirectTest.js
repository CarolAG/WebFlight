/* global describe, it */
'use strict'

// Testing requirements
const path = require('path')
const chai = require('chai');
let assert = chai.assert
let expect = chai.expect
// let should = chai.should
const chaiAsPromised = require('chai-as-promised')
//const chaifs = require('chai-fs')
chai.use(chaiAsPromised)
//chai.use(chaifs)

// Functions being tested
const WfRedirect = require('./wfredirect.js');

const defaultFile = {
    defaultHTML: 'index.html'
}

const requestObj = {originalUrl: '/' }

const redirectFile = function (){
  //console.log('global',global);
  console.log('WfRedirect', WfRedirect.redirect(requestObj));
  global.routes = {'/':'imageFilePath'}
  return WfRedirect.redirect(requestObj)
}


describe('redirecting to torrented files', () => {
  it('output should be the file we re-direct to not default file', () => {
    assert.notEqual(defaultFile.defaultHTML, redirectFile())
  })
})
