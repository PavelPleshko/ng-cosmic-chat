module.exports.init = initRoutes;

function initRoutes(app) {
  const routesPath = app.get('root') + '/app/routes';

  app.use('/auth', require(routesPath + '/auth'));
  app.use('/api', require(routesPath + '/users'));
}