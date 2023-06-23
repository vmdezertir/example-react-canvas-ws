const fastify = require('fastify')({
  logger: true
});
const path = require('node:path');

// Register plugins
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/helmet'));
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
  constraints: {}
});
fastify.register(require('@fastify/websocket'), {
  options: { maxPayload: 1048576 }
});

// Register routes
fastify.register(require('./routes/common'), { prefix: '/api' });
fastify.register(require('./routes/meet'), { prefix: '/api/meet' });
fastify.register(require('./routes/wsMeet'), { prefix: '/api/connect' });

fastify.listen({ port: 8080 }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})



















// const express = require('express');
// const cors = require('cors');
// const path = require('node:path');
// const { readFileSync, writeFileSync } = require('node:fs');
//
// const app = express();
// const expressWs = require('express-ws')(app);
//
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
//
// const getImagePath = (meetId) => path.resolve(__dirname, 'files', `${meetId}.jpg`);
// const BASE64_STR = 'data:image/png;base64,';
//
// // REST Routes
// app.post('/meet/:meetId', (req, res) => {
//   try {
//     const { screenImg } = req.body;
//     const { meetId } = req.params;
//
//     const data = screenImg.replace(BASE64_STR, '');
//     writeFileSync(getImagePath(meetId), data, 'base64');
//
//     return res.status(200).json({ msg: 'Successfully uploaded' })
//   } catch (e) {
//     return res.status(500).json({ msg: 'Something went wrong'});
//   }
// });
//
// app.get('/meet/:meetId', (req, res) => {
//   try {
//     const { meetId } = req.params;
//     const file = readFileSync(getImagePath(meetId));
//     const data = `${BASE64_STR}${file.toString('base64')}`;
//
//     return res.status(200).json(data);
//   } catch (e) {
//     return res.status(500).json({ msg: 'Something went wrong'});
//   }
// });
//
// // Socket routes
// app.ws('/meet/:meetId', function(ws, req) {
//   const { meetId } = req.params;
//   ws.room = meetId;
//
//   ws.on('message', message => {
//     message = JSON.parse(message.toString());
//
//     switch (message.eventType) {
//       case 'connection':
//         broadcastMsg(meetId, { ...message, notification: `User named "${message.participant}" connected` });
//         break;
//       case 'draw':
//         broadcastMsg(meetId, message);
//         break;
//       case 'clear':
//         broadcastMsg(meetId, { ...message, notification: `User named "${message.participant}" just cleared the canvas` });
//         break;
//     }
//   });
// });
//
// function broadcastMsg(meetId, message) {
//   const { clients } = expressWs.getWss();
//   clients?.forEach(client => {
//     if (client.room === meetId && client.readyState === 1) {
//       client.send(JSON.stringify(message));
//     }
//   });
// }
//
// app.listen(8080);
