const commonRoutes = (app, opts, done) => {
  // health check
  app.get('/health', (request, reply) => {
    return reply.send({ msg: 'Ok' });
  });

  done();
};

module.exports = commonRoutes;
