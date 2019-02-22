const jwt = require('jsonwebtoken');

const { jwtKey } = require('./authentication');
const { setIO } = require('./globals');
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

  setIO(io);

  io.on('connection', socket => {

    let user = null;
    let currentRoom = null;

    socket.emit('loginReq');

    socket.on('loginRes', async token => {

      console.log('trying');

      user = await checkToken(token);

      if (!user) {

        socket.emit('loginFailure');
        console.log('fail');
        return;

      }

      socket.emit('loginSuccess');
      console.log('success');

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
        currentRoom = room;
        io.to(room).emit('newUser', user.username);
        rooms.push(new PokerRoom(room, user));
        socket.broadcast.emit('roomList', rooms);

      }

    });

    socket.on('joinRoom', async room => {

      const user = await checkToken(token);

      if (!user) {

        socket.emit('loginFailure');
        return;

      }

      const createdRoom = rooms.find(existingRoom => existingRoom.name === room);

      if (!createdRoom) {

        socket.emit('error', 'Room does not exist!');

      }

      else if (createdRoom.isFull()) {

        socket.emit('error', 'Room is full!');

      }

      else {

        socket.join(room);
        currentRoom = room;

      }

    });

    socket.on('getRooms', () => {

      socket.emit('roomList', rooms);

    });

    socket.on('disconnect', () => {

      console.log('disconnect', user, currentRoom);

      if (currentRoom) {

        const room = rooms.find(existingRoom => existingRoom.name === currentRoom);
        const length = room.removeUser(user);
        console.log(length);

        if (length === 0) {

          const index = rooms.map(room => room.name).indexOf(room.name);
          console.log(`${currentRoom} has no more users`);
          rooms.splice(index, 1);
          socket.broadcast.emit('roomList', rooms);

        }

      }

    });

  });

}

module.exports = {

  start

}
