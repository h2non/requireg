var expect = require('expect.js')
var requiregModule = require('../lib/requireg')

describe('requireg', function () {

  it('should be a function', function () {
    expect(requiregModule).to.be.a('function')
  })

  describe('requireg API', function () {
    
    it('should globalize', function () {
      requiregModule.globalize()
      expect(requireg).to.be.a('function')
    })

  })

  describe('local modules', function () {

    it('should resolve a local module', function () {
      expect(requiregModule('expect.js')).to.be.equal(expect)
    })

    it('should throw an Error exception when no local module exists', function () {
      expect(function () { requiregModule('nonexistent') }).to.throwError()
    })

  })

  describe('global modules', function () {

  })

})