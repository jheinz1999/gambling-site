const { getIO, checkToken } = require('../common/globals');
const { db } = require('../data/db');

class Room {

  constructor(name, buyIn, leader) {

    leader.isLeader = true;

    this.name = name;
    this.users = [];
    this.sockets = [];
    this.leaderID = leader.id;
    this.ready = 0;
    this.playing = false;
    this.buyIn = buyIn;
    this.cash = [];

    this.clearIO();
    this.listenIO();

    return new Promise(async (resolve, reject) => {
      await this.addUser(leader);
      resolve(this);
    });

  }

  startPlaying() {

    this.playing = true;

  }

  emit(message, data) {

    getIO().to(this.name).emit(message, data);

  }

  getClients() {

    console.log('room', this.name);

    const inRoom = Object.keys(getIO().sockets.adapter.rooms[this.name].sockets);

    this.sockets = Object.entries(getIO().of('/').adapter.nsp.connected)
      .filter(obj => inRoom.indexOf(obj[0]) !== -1)
      .map(obj => obj[1]);

    console.log(this.sockets.length);

  }

  clearIO() {

    this.sockets.forEach(socket => {

      socket.removeAllListeners('usersReq');
      socket.removeAllListeners('sendMsg');

    });

  }

  listenIO() {

    this.clearIO();
    this.getClients();

    this.sockets.forEach(socket => {

      socket.on('usersReq', () => {

        console.log('requested homie');

        this.emit('users', this.users);

      });

      socket.on('sendMsg', data => {

        console.log(this.sockets.length);

        this.emit('newMsg', data);

      });

      socket.on('startGame', async token => {

        const user = await checkToken(token);

        if (!user) {

          socket.emit('error', 'you are not logged in');
          return;

        }

        if (user.id !== this.leaderID) {

          socket.emit('error', 'you are not the leader');
          return;

        }

        this.emit('startGame');

      });

      socket.on('readyToStart', id => {

        for (let i = 0; i < this.users.length; i++) {

          this.cash.push(this.buyIn);
          console.log('pushed?');

        }

        if (this.users.find(user => user.id === id)) {

          this.ready++;

          console.log('ready', id, this.ready, this.cash);

          if (this.ready === this.users.length) {
            this.emit('allReady');
            this.startPlaying();
          }

        }

      });

    });

  }

  async addUser(user) {

    return new Promise(async (resolve, reject) => {

      const newUserObj = await db.select('u.username', 'u.id', 'u.cash', 'i.img_url').from('users as u').join('images as i', 'u.img_id', 'i.id').where('username', user.username).first();

      this.users.push(newUserObj);
      this.clearIO();
      this.listenIO();
      this.emit('newUser', newUserObj.username);
      this.emit('users', this.users);
      this.emit('newMsg', {
        user: '[server]',
        message: 'a new challenger approaches'
      });
      this.emit('newMsg', {
        user: '[server]',
        message: `${user.username} has entered the game`
      });

      resolve();

    });

  }

  removeUser(user) {

    const index = this.users.map(user => user.username).indexOf(user.username);

    if (index !== -1) {

      const [loggedOff] = this.users.splice(index, 1);
      this.emit('newMsg', {
        user: '[server]',
        message: `${user.username} has rage quit`
      });
      this.emit('users', this.users);

      console.log('user logged off');

      if (loggedOff.isLeader && this.users.length > 0) {

        this.users[0].isLeader = true;
        this.leaderID = this.users[0].id;
        this.emit('newLeader', this.users[0].user_id);

      }

      this.clearIO();
      this.listenIO();

      return this.users.length;

    }

  }

  isFull() {

    return this.users.length === 5;

  }

}

module.exports = Room;
