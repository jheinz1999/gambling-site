const express = require('express');
const Deck = require('./cards/Deck');

const server = express();

server.use(express.json());

const firstDeck = new Deck();

const hand1 = firstDeck.draw();
const hand5 = firstDeck.draw(5);

console.log(hand1, hand5, firstDeck.getLength());

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server live on port ${port}`));
