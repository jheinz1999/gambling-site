const jwt = require('jsonwebtoken');

const { jwtKey } = require('./authentication');

const PokerRoom = require('../rooms/PokerRoom');
const rooms = [];

function checkToken(token) {

  return new Promise(function(resolve, reject) {

    jwt.verify(token, jwtKey, (err, user) => {

      if (err)
        resolve(null);

      else
        resolve(user);

    });

  });

}

async function start(io) {

  io.on('connection', socket => {

    socket.emit('loginReq');

    socket.on('loginRes', async token => {

      const user = await checkToken(token);

      if (!user) {

        socket.emit('loginFailure');
        return;

      }

      socket.emit('loginSuccess');

    });

    socket.on('createRoom', async data => {

      console.log('room req');

      const { room, token } = data;

      const user = await checkToken(token);

      if (!user) {

        socket.emit('loginFailure');
        return;

      }

      const createdRoom = rooms.find(existingRoom => existingRoom.name === room);

      if (createdRoom) {

        socket.emit('error', 'room exists!');

      }

      else {

        socket.emit('createRoomSuccess', room);
        socket.join(room);
        io.to(room).emit('newUser', user.username);
        rooms.push(new PokerRoom(room, user));
        console.log('success');

      }

    });

    socket.on('joinRoom', async room => {

      const user = await checkToken(token);

      if (!user) {

        socket.emit('loginFailure');
        return;

      }

      const [createdRoom] = rooms.find(existingRoom => existingRoom.name === room);

      if (!createdRoom) {

        socket.emit('error', 'Room does not exist!');

      }

      else if (createdRoom.isFull()) {

        socket.emit('error', 'Room is full!');

      }

      else {

        socket.join(room);

      }

    });

    socket.on('getRooms', () => {

      socket.emit('roomList', rooms);

    });

  });

}

module.exports = {

  start

}
