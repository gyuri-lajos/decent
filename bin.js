var fs = require('fs')
var path = require('path')
var ssbKeys = require('ssb-keys')
var stringify = require('pull-stringify')
var yargs = require('yargs').argv
var open = require('opn')
var muxrpcli = require('muxrpcli')

var config = require('./config/inject')(yargs.appname || 'decent')

config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

var manifestFile = path.join(config.path, 'manifest.json')

var decentClient = fs.readFileSync(path.join('./build/index.html'))

var argv = process.argv.slice(2)
var i = argv.indexOf('--')
var conf = argv.slice(i+1)
argv = ~i ? argv.slice(0, i) : argv

if (argv[0] == 'server') {
  var createSbot = require('scuttlebot')
    .use(require('scuttlebot/plugins/master'))
    .use(require('scuttlebot/plugins/gossip'))
    .use(require('scuttlebot/plugins/replicate'))
    .use(require('ssb-friends'))
    .use(require('ssb-blobs'))
    .use(require('ssb-query'))
    .use(require('ssb-links'))
    .use(require('ssb-ebt'))
    .use(require('scuttlebot/plugins/invite'))
    .use(require('scuttlebot/plugins/local'))
    .use(require('decent-ws'))
    .use({
      name: 'serve',
      version: '1.0.0',
      init: function (sbot) {
        sbot.ws.use(function (req, res, next) {
          var send = {} 
          send = config
          delete send.keys
          send.address = sbot.ws.getAddress()
          if(req.url == '/')
            res.end(decentClient)
          if(req.url == '/get-config')
            res.end(JSON.stringify(send))
          else next()
        })
      }
    })
  
  open('http://localhost:' + config.ws.port, {wait: false})
  
  var server = createSbot(config)
  
  fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))

} else {

  var manifest
  try {
    manifest = JSON.parse(fs.readFileSync(manifestFile))
  } catch (err) {
    throw explain(err,
      'no manifest file'
      + '- should be generated first time server is run'
    )
  }

  // connect
  require('ssb-client')(config.keys, {
    manifest: manifest,
    port: config.port,
    host: config.host||'localhost',
    caps: config.caps,
    key: config.key || config.keys.id
  }, function (err, rpc) {
    if(err) {
      if (/could not connect/.test(err.message)) {
        console.log('Error: Could not connect to the scuttlebot server.')
        console.log('Use the "server" command to start it.')
        if(config.verbose) throw err
        process.exit(1)
      }
      throw err
    }

    // add some extra commands
    manifest.version = 'async'
    manifest.config = 'sync'
    rpc.version = function (cb) {
      console.log(require('./package.json').version)
      cb()
    }
    rpc.config = function (cb) {
      console.log(JSON.stringify(config, null, 2))
      cb()
    }

    // run commandline flow
    muxrpcli(argv, manifest, rpc, config.verbose)
  })
}



