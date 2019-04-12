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
        newThis.cards = [null, null, null, null, null];
        newThis.bet = 0;
        newThis.turn = 0;
        newThis.stage = 0;
        newThis.bets = [];

      })

  }

  listenIO() {

    super.listenIO();

    this.sockets.forEach(socket => {

      socket.on('turnTaken', obj => {

        if (this.turn === obj.id) {

          if (obj.action === 'call') {

            this.cash[this.turn] -= this.bet - this.bets[this.turn];
            this.bets[this.turn] = this.bet;
            this.emit('newBets', this.bets);
            this.emit('newGameCash', this.cash);

            this.nextTurn();

          }

          if (obj.action === 'raise') {

            this.cash[this.turn] -= this.bet + obj.payload - this.bets[this.turn];
            this.bets[this.turn] = this.bet + obj.payload;
            this.bet += obj.payload;
            this.emit('newBets', this.bets);
            this.emit('newBet', this.bet);
            this.emit('newGameCash', this.cash);
            this.nextTurn();

          }

        }

      })

    });

  }

  dealCards() {

    for (let i = 0; i < this.users.length; i++) {

      this.hands.push(this.deck.draw(2));
      getIO().to(`user_room_${this.users[i].username}`).emit('newHand', this.hands[i]);

    }

  }

  nextStage() {

    this.stage++;

    this.pot += this.bets.reduce((acc, val) => acc + val);
    this.bets = this.users.map(() => 0);
    this.bet = 0;

    this.emit('newPot', this.pot);
    this.emit('newBets', this.bets);
    this.emit('newBet', this.bet);

    if (this.stage === 1) {

      this.cards = this.deck.draw(3).concat([null, null]);

      console.log('cards', this.cards);

      this.emit('newCards', this.cards);

    }

  }

  nextTurn() {

    this.turn++;

    if (this.turn > this.users.length - 1) {

      this.turn = 0;

      if (this.bets[0] === this.bets[this.bets.length - 1])
        this.nextStage();

    }

    const bet = this.bets[0];
    let even = true;

    for (let i = 1; i < this.bets.length; i++) {

      if (bet !== this.bets[i]) {

        even = false;
        break;

      }

    }

    if (!even)
      this.emit('newTurn', this.turn);

    else {

      this.emit('newTurn', 0);
      this.nextStage();

    }

  }

  setupInitialBet() {

    for (let i = 0; i < this.users.length; i++) {

      this.bets.push(0);

    }

    this.cash[0] -= this.buyIn / 100;
    this.cash[1] -= this.buyIn * 2 / 100;

    this.bets[0] = this.buyIn / 100;
    this.bets[1] = this.buyIn * 2 / 100;

    this.pot = 0;
    this.bet = this.buyIn * 2 / 100;

    this.turn = this.users.length > 2 ? 2 : 0;

    this.emit('newGameCash', this.cash);
    this.emit('newBet', this.bet);
    this.emit('newBets', this.bets);
    this.emit('newTurn', this.turn);

  }

  startPlaying() {

    super.startPlaying();

    this.dealCards();
    this.setupInitialBet();

  }

}

module.exports = PokerRoom;
