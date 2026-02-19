export function printRoutes(app) {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      // Routes registered via router
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push(handler.route);
        }
      });
    }
  });
  
  console.log('\n=== REGISTERED ROUTES ===');
  routes.forEach(route => {
    const methods = Object.keys(route.methods).join(', ').toUpperCase();
    console.log(`${methods} ${route.path}`);
  });
  console.log('=========================\n');
}