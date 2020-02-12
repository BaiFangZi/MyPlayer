var express = require('express')
var app = express()

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.get('/xxx', function (req, res) {
  console.log('xxx  start')
  res.end()
})
app.listen(3000)
console.log('成功启动3000端口')
