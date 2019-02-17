const { io } = require('../common/io');

class Room {

  constructor(name, leader) {

    this.name = name;
    this.users = [];
    this.leaderID = leader.id;

  }

  addUser(user) {

    this.users.push(user);
    io.to(this.name).emit('newUser', user.username);

  }

  removeUser(user) {

    const index = this.users.indexOf(user);

    if (index !== -1) {

      const [loggedOff] = this.users.splice(index, 1);
      io.to(this.name).emit('userLoggedOff', loggedOff);

    }

  }

  isFull() {

    return this.users.length === 5;

  }

}

module.exports = Room;
