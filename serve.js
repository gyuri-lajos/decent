var http = require('http')
var serve = require('ecstatic')

http.createServer(
  serve({ root: __dirname + '/build/'})
).listen(3636)

