const path = require('node:path');
const { readFileSync, writeFileSync } = require('node:fs');
import { nanoid } from 'nanoid';

const getImagePath = (meetId) => path.resolve(process.cwd(), 'public/images', `${meetId}.jpg`);
const BASE64_STR = 'data:image/png;base64,';

const rooms = new Set();

const meetRoutes = (app, opts, done) => {
  // create room
  app.post('/', (request, reply) => {
    const meetId = nanoid(10);
    rooms.set(meetId);

    return reply.send({ meetId });
  });

  // check if this room exists
  app.get('/:meetId', (request, reply) => {
    const { meetId } = request.params;
    const isExist = rooms.has(meetId);

    if (isExist) {
      return reply.send({ meetId, msg: 'Room ' });
    }

    return reply.code(404).send({ msg: 'Room with this ID does not exist' });
  });

  // create a new screenshot
  app.post('/image/:meetId', (request, reply) => {
    const { screenImg } = request.body;
    const { meetId } = request.params;

    const data = screenImg.replace(BASE64_STR, '');
    writeFileSync(getImagePath(meetId), data, 'base64');

    return reply.send({ msg: 'Successfully uploaded' });
  });

  // get a current screenshot
  app.get('/image/:meetId', (request, reply) => {
    const { meetId } = request.params;
    let file;
    try {
      file = readFileSync(getImagePath(meetId));
    } catch (e) {
      return reply.code(404).send({ msg: 'File not found' });
    }
    const data = `${BASE64_STR}${file.toString('base64')}`;

    return reply.send(Buffer.from(data));
  });

  done();
};

module.exports = meetRoutes;
