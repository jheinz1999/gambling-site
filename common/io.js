const jwt = require('jsonwebtoken');
const server = require('../server');
const io = require('socket.io')(server);

const { jwtKey } = require('./authentication');

const PokerRoom = require('../rooms/PokerRoom');
const rooms = [];

function start() {

  console.log('started?');

  io.on('connection', socket => {

    console.log('connected?');

    socket.emit('loginReq');

    socket.on('loginRes', data => {

      jwt.verify(token, jwtKey, (err, user) => {

        if (err) {

          socket.emit('loginFailure');

        }

        else {

          socket.emit('loginSuccess');

          socket.on('createRoom', room => {

            const [createdRoom] = rooms.find(existingRoom => existingRoom.name === room);

            if (createdRoom) {

              socket.emit('error', 'room exists!');

            }

            else {

              socket.join(room);
              rooms.push(new PokerRoom(room, user));

            }

          });

          socket.on('joinRoom', room => {

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

        }

      });

    });

  });

}

module.exports = {

  start,
  io

}
