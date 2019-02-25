const { getIO } = require('../common/globals');

class Room {

  constructor(name, leader) {

    leader.isLeader = true;

    this.name = name;
    this.users = [leader];
    this.sockets = [];
    this.leaderID = leader.id;

    this.listenIO();

  }

  emit(message, data) {

    getIO().to(this.name).emit(message, data);

  }

  getClients() {

    const inRoom = Object.keys(getIO().sockets.adapter.rooms[this.name].sockets);

    this.sockets = Object.entries(getIO().of('/').adapter.nsp.connected)
      .filter(obj => inRoom.indexOf(obj[0]) !== -1)
      .map(obj => obj[1]);

    console.log(this.sockets.length);

  }

  listenIO() {

    this.getClients();

    this.sockets.forEach(socket => {

      socket.on('usersReq', () => {

        console.log('requested homie');

        this.emit('users', this.users);

      });

      socket.on('left', username => {

        const user = this.users.find(u => u.username === username);
        removeUser(user);

      });

      socket.on('sendMsg', data => {

        emit('newMsg', data);

      });

    });

  }

  addUser(user) {

    this.users.push(user);
    this.getClients();
    this.emit('newUser', user.username);
    this.emit('users', this.users);

  }

  removeUser(user) {

    const index = this.users.map(user => user.username).indexOf(user.username);

    if (index !== -1) {

      const [loggedOff] = this.users.splice(index, 1);
      this.emit('userLoggedOff', loggedOff);
      this.emit('users', this.users);

      console.log('user logged off');

      if (loggedOff.isLeader && this.users.length > 0) {

        this.users[0].isLeader = true;
        this.leaderID = this.users[0].id;
        this.emit('newLeader', this.users[0].username);

      }

      this.getClients();

      return this.users.length;

    }

  }

  isFull() {

    return this.users.length === 5;

  }

}

module.exports = Room;
