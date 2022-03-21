module.exports = (app, server) => {
  app.listen(process.env.PORT, () => {
    console.log(process.env.PORT + ' server start');
  });
  server.listen(443, () => {
    console.log('443 server start');
  });
};
