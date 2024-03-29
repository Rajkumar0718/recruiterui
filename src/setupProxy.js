const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api1',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8801',
      changeOrigin: true,
    })
  );
  app.use(
    '/api2',
    createProxyMiddleware({
      target:'http://192.168.1.36:8802',
      changeOrigin: true,
    })
  );

  app.listen(3200)
}
