const Room = require('./Room');

class PokerRoom extends Room {

  constructor(name, leader) {

    super(name, leader);

  }

  startPlaying() {

    super.startPlaying();

  }

}

module.exports = PokerRoom;
