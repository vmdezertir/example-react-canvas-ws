const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { readFileSync, writeFileSync } = require('node:fs');

const app = express();
const expressWs = require('express-ws')(app);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const getImagePath = (meetId) => path.resolve(__dirname, 'files', `${meetId}.jpg`);
const BASE64_STR = 'data:image/png;base64,';

// REST Routes
app.post('/meet/:meetId', (req, res) => {
  try {
    const { screenImg } = req.body;
    const { meetId } = req.params;

    const data = screenImg.replace(BASE64_STR, '');
    writeFileSync(getImagePath(meetId), data, 'base64');

    return res.status(200).json({ msg: 'Successfully uploaded' })
  } catch (e) {
    return res.status(500).json({ msg: 'Something went wrong'});
  }
});

app.get('/meet/:meetId', (req, res) => {
  try {
    const { meetId } = req.params;
    const file = readFileSync(getImagePath(meetId));
    const data = `${BASE64_STR}${file.toString('base64')}`;

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ msg: 'Something went wrong'});
  }
});

// Socket routes
app.ws('/meet/:meetId', function(ws, req) {
  const { meetId } = req.params;
  ws.room = meetId;

  ws.on('message', message => {
    message = JSON.parse(message.toString());

    switch (message.eventType) {
      case 'connection':
        broadcastMsg(meetId, { ...message, notification: `User named "${message.participant}" connected` });
        break;
      case 'draw':
        broadcastMsg(meetId, message);
        break;
      case 'clear':
        broadcastMsg(meetId, { ...message, notification: `User named "${message.participant}" just cleared the canvas` });
        break;
    }
  });
});

function broadcastMsg(meetId, message) {
  const { clients } = expressWs.getWss();
  clients?.forEach(client => {
    if (client.room === meetId && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

app.listen(8080);
