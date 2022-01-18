module.exports = (app, server) => {
  app.listen(80, () => {
    console.log('80 server start');
  });
  server.listen(443, () => {
    console.log('443 server start');
  });
};
