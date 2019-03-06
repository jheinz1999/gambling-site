const Room = require('./Room');
const Deck = require('../cards/Deck');
const { getIO } = require('../common/globals');

class PokerRoom extends Room {

  constructor(name, buyIn, leader) {

    super(name, buyIn, leader);
    this.hands = [];
    this.deck = new Deck();
    this.pot = 0;
    this.turn = 0;

  }

  startPlaying() {

    super.startPlaying();

    for (let i = 0; i < this.users.length; i++) {

      this.hands.push(this.deck.draw(2));
      getIO().to(this.users[i].username).emit('newHand', this.hands[i]);

    }

  }

}

module.exports = PokerRoom;
