const path = require('node:path');
const { readFileSync, writeFileSync } = require('node:fs');
const { nanoid } = require('nanoid');

const getImagePath = (meetId) => path.resolve(process.cwd(), 'public/images', `${meetId}.jpg`);
const BASE64_STR = 'data:image/png;base64,';

const rooms = new Set();

const checkRoomId = (request, reply, done) => {
  const { meetId } = request.params;
  const isExist = rooms.has(meetId);

  if (!isExist) {
    reply.code(404).send({ msg: 'Room with this ID does not exist' });
  }

  done();
};

const meetRoutes = (app, opts, done) => {
  // create room
  app.post('/', (request, reply) => {
    const meetId = nanoid(10);
    rooms.add(meetId);

    return reply.send({ meetId });
  });

  // check if this room exists
  app.get('/:meetId', { preHandler: [checkRoomId] }, (request, reply) => {
    const { meetId } = request.params;
    return reply.send({ meetId, msg: 'The room exists' });
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
  app.get('/image/:meetId', { preHandler: [checkRoomId] }, (request, reply) => {
    const { meetId } = request.params;
    try {
      const file = readFileSync(getImagePath(meetId));
      const data = `${BASE64_STR}${file.toString('base64')}`;

      return reply.send(Buffer.from(data));
    } catch (e) {
      return reply.send(null);
    }
  });

  done();
};

module.exports = meetRoutes;
