const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/health_check', function(req, res) {
	res.send(200, "OK");
})

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

bind = process.env.BIND_PATH || '/donki/node.socket'

app.listen(bind);
