const jwt = require('jsonwebtoken');

const { jwtKey } = require('./authentication');
const { setIO, getIO } = require('./globals');
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

function sendToAll(message, data) {

  Object.values(getIO().of('/').adapter.nsp.connected).forEach(socket => {

    socket.emit(message, data);

  });

}

function sendRooms() {

  return rooms.map(room => {
    return {
      name: room.name,
      users: room.users,
      leaderID: room.leaderID
    }
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
        rooms.push(new PokerRoom(room, user));
        sendToAll('roomList', sendRooms());

      }

    });

    socket.on('joinRoom', async data => {

      const { room, token } = data;

      console.log('token', token)

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
        createdRoom.addUser(user);
        currentRoom = room;
        socket.emit('joinSuccess');

      }

    });

    socket.on('getRooms', () => {

      sendToAll('roomList', sendRooms());

    });

    socket.on('roomReq', name => {

      const room = rooms.find(room => room.name === name);

      if (!room) {

        socket.emit('nonexistentRoom');

      }

      else {

        socket.emit('room', {
          name: room.name,
          users: room.users,
          leaderID: room.leaderID
        });

      }

    });

    socket.on('disconnect', () => {

      console.log('disconnect', user, currentRoom);

      if (currentRoom) {

        const room = rooms.find(existingRoom => existingRoom.name === currentRoom);

        if (room && user) {

          const length = room.removeUser(user);

          if (length === 0) {

            const index = rooms.map(room => room.name).indexOf(room.name);
            console.log(`${currentRoom} has no more users`);
            rooms.splice(index, 1);
            sendToAll('roomList', sendRooms());

          }

        }

      }

    });

  });

}

module.exports = {

  start

}
