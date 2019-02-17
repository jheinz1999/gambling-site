const Card = require('./Card');

class Deck {

  constructor() {

    this.deck = [];

    // Shuffle deck
    this.shuffle();

  }

  populateDeck() {

    for (let i = 1; i <= 13; i++) {

      for (let j = 0; j < 4; j++) {

        let suit;

        switch (j) {

          case 0:

            suit = 'S';
            break;

          case 1:

            suit = 'C';
            break;

          case 2:

            suit = 'H';
            break;

          case 3:

            suit = 'D';
            break;

          default:

            suit = null;

        }

        this.deck.push(new Card(i, suit));

      }

    }

  }

  shuffle() {

    this.populateDeck();

    let oldDeck = this.deck;
    this.deck = [];

    while (oldDeck.length) {

      const index = Math.floor(Math.random() * oldDeck.length);

      this.deck.push(oldDeck.splice(index, 1)[0]);

    }

  }

  draw(num = 1) {

    return this.deck.splice(this.deck.length - num, num);

  }

  getLength() {

    return this.deck.length;

  }

}

module.exports = Deck;
