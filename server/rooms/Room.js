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

  listenIO() {

    console.log('LISTENING NIBBAS');

    const sockets = Object.values(getIO().of('/').adapter.nsp.connected);

    sockets.forEach(socket => {

      socket.on('usersReq', () => {

        console.log('requested nibba');

        this.emit('users', this.users);

      });

    });

  }

  addUser(user) {

    this.users.push(user);
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

      return this.users.length;

    }

  }

  isFull() {

    return this.users.length === 5;

  }

}

module.exports = Room;
