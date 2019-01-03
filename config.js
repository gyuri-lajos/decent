var http = require('http')

module.exports = function () {
  var host = window.location.origin

  function getConfig () {
    http.get(host + '/get-config', function (res) {
      res.on('data', function (data, remote) {
        var config = data
        localStorage[host] = config
      })
    })
  }

  if (localStorage[host]) {
    var config = JSON.parse(localStorage[host])
    getConfig()
  } else {
    getConfig()
    setTimeout(function () {
      location.reload()
    }, 1000)
  }

  config.blobsUrl = host + '/blobs/get/'
  config.emojiUrl = host + '/img/emoji/'
  if (config.address) {
    addies = config.address.split(';')
    config.remote = addies[1]
  } 

  return config
}
