<<<<<<< HEAD
const express = require('express');
const Deck = require('./cards/Deck');
const Card = require('./cards/Card');
const solver = require('./games/poker/solver');

const server = express();

server.use(express.json());

const deck = new Deck();

const hand = deck.draw(5);

for (let i = 0; i < 5; i++) {

  console.log(hand[i].card, hand[i].suit);

}

console.log(solver(hand));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server live on port ${port}`)); 
