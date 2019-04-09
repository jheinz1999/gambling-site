const { setIO, getIO, checkToken } = require('./globals');
const PokerRoom = require('../rooms/PokerRoom');
const db = require('../data/db');

const rooms = [];

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
      leaderID: room.leaderID,
      playing: room.playing,
      buyIn: room.buyIn
    }
  });

}

async function removeFromRoom(user, roomName) {

  const room = rooms.find(existingRoom => existingRoom.name === roomName);

  if (room && user) {

    const length = room.removeUser(user);

    if (length === 0) {

      const index = rooms.map(room => room.name).indexOf(room.name);
      console.log(`${roomName} has no more users`);
      rooms.splice(index, 1);
      sendToAll('roomList', sendRooms());

    }

    if (!room.playing) {

      await db.changeCash(user.id, room.buyIn);

    }

  }

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

      // join room of user so server can have private messages to user
      socket.join(`user_room_${user.username}`);
      console.log('joined a room called', `user_room_${user.username}`);

      socket.emit('loginSuccess');
      console.log('success');

    });

    socket.on('createRoom', async data => {

      console.log('room req');

      const { room, buyIn, token } = data;

      const user = await checkToken(token);

      if (!user) {

        socket.emit('loginFailure');
        return;

      }

      const createdRoom = rooms.find(existingRoom => existingRoom.name === room);

      if (createdRoom) {

        socket.emit('error', 'room exists!');

      }

      else if (user.cash < buyIn) {

        socket.emit('cashError');

      }

      else {

        const cashLeft = await db.changeCash(user.id, -1 * buyIn);
        socket.emit('cashChange', cashLeft);
        socket.emit('createRoomSuccess', room);
        socket.join(room);
        currentRoom = room;
        console.log('join',user);
        rooms.push(new PokerRoom(room, buyIn, user));
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

        const cashLeft = await db.changeCash(user.id, -1 * createdRoom.buyIn);
        socket.emit('cashChange', cashLeft);
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

    socket.on('leftRoom', room => {

      console.log('outie');

      removeFromRoom(user, room);
      currentRoom = null;
      socket.removeAllListeners('usersReq');
      socket.removeAllListeners('sendMsg');

    });

    socket.on('disconnect', () => {

      console.log('disconnect', user, currentRoom);

      if (currentRoom) {

        removeFromRoom(user, currentRoom);

      }

    });

  });

}

module.exports = {

  start

}
