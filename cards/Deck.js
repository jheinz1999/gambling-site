const Card = require('./Card');

class Deck {

  constructor() {

    this.deck = [];

    // Shuffle deck
    this.shuffle();

  }

  populateDeck() {

    for (let i = 1; i <= 13; i++) {

      let card;

      switch (i) {

        case 1:

          card = 'A';
          break;

        case 11:

          card = 'J';
          break;

        case 12:

          card = 'Q';
          break;

        case 13:

          card = 'K';
          break;

        default:

          card = '' + i;

      }

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

        this.deck.push(new Card(card, suit));

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
