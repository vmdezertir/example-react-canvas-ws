const fastify = require('fastify')();

fastify.register(require('@fastify/websocket'));
fastify.register(async function (fastify) {
  fastify.get('/meet/:meetId', { websocket: true }, (connection , request) => {
    const ws = connection.socket;
    const { meetId } = request.params;
    ws.on('message', message => {
      message = JSON.parse(message);

      switch (message.event) {
        case 'connection':
          broadcastMsg(ws, message, meetId);
          break;
        case 'draw':
          broadcastMsg(ws, message, meetId);
          break;
      }
    });
  })
})

function broadcastMsg(ws, message, meetId) {
  ws?.clients?.forEach(client => {
    if (client.id === meetId) {
      client.send(JSON.stringify(message));
    }
  });
}

fastify.listen({ port: 8080 }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
