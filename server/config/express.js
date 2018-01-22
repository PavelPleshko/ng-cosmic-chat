const path = require('path');
const bodyParser = require('body-parser');
const config = require('./index');

module.exports.init = initExpress;

function initExpress(app) {
  const root = app.get('root');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.disable('x-powered-by');

 
  app.use(function(req, res, next) {
    req.resources = req.resources || {};
    next();
  });
};