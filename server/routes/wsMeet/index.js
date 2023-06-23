function broadcastMsg(ws, meetId, message) {
  ws.clients?.forEach(client => {
    if (client.room === meetId && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

async function wsMeetRoutes (app) {
  app.get('/:meetId', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    const { meetId } = req.params;
    connection.socket.room = meetId;

    connection.socket.on('message', message => {
      message = JSON.parse(message.toString());

      switch (message.eventType) {
        case 'connection':
          broadcastMsg(app.websocketServer, meetId, { ...message, notification: `User named "${message.participant}" connected` });
          break;
        case 'draw':
          broadcastMsg(app.websocketServer, meetId, message);
          break;
        case 'clear':
          broadcastMsg(app.websocketServer, meetId, { ...message, notification: `User named "${message.participant}" just cleared the canvas` });
          break;
      }
    })
  })
}

module.exports = wsMeetRoutes;
