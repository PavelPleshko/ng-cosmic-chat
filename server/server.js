// Get environment or set default environment to development
const ENV = process.env.NODE_ENV || 'development';
const DEFAULT_PORT = 3000;
const DEFAULT_HOSTNAME = '127.0.0.1';
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const config = require('./config');
const app = express();


let server = http.Server(app);


app.set('config', config);
app.set('root', __dirname);
app.set('env', ENV);


//require('./config/models').init(app);
require('./config/express').init(app);
require('./config/routes').init(app);



app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).json(err);
});

if (!module.parent) {
  server = http.createServer(app);
  server.listen(
    config.port || DEFAULT_PORT,
    config.hostname || DEFAULT_HOSTNAME,
    () => {
      console.log(`${config.app.name} is running`);
      console.log(`   listening on port: ${config.port}`);
      console.log(`   environment: ${ENV.toLowerCase()}`);
    }
  );
}
require('./app/services/chat')(app, server);

module.exports = app;