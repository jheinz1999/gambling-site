const express = require('express');
const Deck = require('./cards/Deck');
const Card = require('./cards/Card');
const solver = require('./games/poker/solver');

const server = express();

server.use(express.json());

const hand1 = [];

hand1.push(new Card(4, 'H'));
hand1.push(new Card(5, 'H'));
hand1.push(new Card(4, 'D'));
hand1.push(new Card(5, 'C'));
hand1.push(new Card(4, 'S'));
hand1.push(new Card(5, 'H'));
hand1.push(new Card(10, 'H'));

console.log(solver(hand1));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server live on port ${port}`));
