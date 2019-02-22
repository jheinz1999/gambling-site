const { getIO } = require('../common/globals');

class Room {

  constructor(name, leader) {

    this.name = name;
    this.users = [leader];
    this.leaderID = leader.id;

  }

  addUser(user) {

    this.users.push(user);
    getIO().to(this.name).emit('newUser', user.username);

  }

  removeUser(user) {

    const index = this.users.map(user => user.username).indexOf(user.username);

    if (index !== -1) {

      const [loggedOff] = this.users.splice(index, 1);
      getIO().to(this.name).emit('userLoggedOff', loggedOff);

      console.log('user logged off');

      return this.users.length;

    }

  }

  isFull() {

    return this.users.length === 5;

  }

}

module.exports = Room;
