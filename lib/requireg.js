var fs   = require('fs') 
var path = require('path')
var resolvers = require('./resolvers')

'use strict';

module.exports = requireg

function requireg(module) {
  var resolver, moduleExports

  for (var i = 0, l = resolvers.length; i < l; i += 1) {
    resolver = resolvers[i]
    if ((resolver = resolver(module)) !== undefined) {
      moduleExports = resolver
      break
    }
  }

  if (moduleExports === undefined) {
    throw new Error("Cannot find global module '"+ module +"'")
  }

  return moduleExports
}

requireg.globalize = function () {
  global.requireg = requireg
}
