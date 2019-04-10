const Room = require('./Room');
const Deck = require('../cards/Deck');
const { getIO } = require('../common/globals');

class PokerRoom extends Room {

  constructor(name, buyIn, leader) {

    super(name, buyIn, leader)
      .then(newThis => {

        newThis.hands = [];
        newThis.deck = new Deck();
        newThis.pot = 0;
        newThis.turn = 0;

      })

  }

  startPlaying() {

    super.startPlaying();

    for (let i = 0; i < this.users.length; i++) {

      this.hands.push(this.deck.draw(2));
      getIO().to(`user_room_${this.users[i].username}`).emit('newHand', this.hands[i]);

    }

  }

}

module.exports = PokerRoom;
