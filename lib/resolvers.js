var fs   = require('fs') 
var path = require('path')
var resolve = require('resolve').sync
var isWin32 = process.platform === 'win32'

'use strict';

// resolvers
module.exports = [
  nativeResolve,
  nodePathResolve,
  userHomeResolve,
  globalResolve
]

function resolveFn(module, basePath, dirname) {
  try {
    return resolve(module, {
      basedir: path.join(basePath, dirname || '')
    })
  } catch (e) {}
}

// resolve using native require() function
// if NODE_PATH is define, a global module should be natively resolved
function nativeResolve(module) {
  try {
    return require.resolve(module)
  } catch (e) {}
}

// See: http://nodejs.org/docs/latest/api/modules.html#modules_loading_from_the_global_folders
// required?
function nodePathResolve(module) {
  var modulePath
  var nodePath = process.env.NODE_PATH

  if (!nodePath) {
    return
  }

  if (isWin32) {
    nodePath = nodePath.replace(':', ';')
  }
  nodePath = nodePath.split(';').map(function (nodepath) {
    return path.normalize(nodepath)
  })

  for (var i = 0, l = nodePath.length; i < l; i += 1) {
    if (modulePath = resolveFn(module, nodePath[i])) {
      break;
    }
  }

  return modulePath
}

function userHomeResolve(module) {
  var modulePath
  var homePath = isWin32 ? process.env['USERPROFILE'] : process.env['HOME']

  var paths = [ 
    'node_modules',
    'node_libraries',
    'node_packages'
  ]

  for (var i = 0, l = paths.length; i < l; i += 1) {
    if (modulePath = resolveFn(module, homePath, paths[i])) {
      break;
    }
  }

  return modulePath
}

// See: https://npmjs.org/doc/files/npm-folders.html#prefix-Configuration
// it uses execPath to discover node_modules based on the node binary location
function globalResolve(module) {
  var modulePath
  var dirname = path.dirname(process.execPath)

  if (!isWin32) {
    dirname = path.join(dirname, '../', 'lib')
  }
  dirname = path.join(dirname, 'node_modules')

  modulePath = resolveFn(module, dirname)

  return modulePath
}
