const express = require('express');
const Card = require('./cards/Card');

const server = express();

server.use(express.json());

const AceofSpades = new Card('A', 'S');

console.log(AceofSpades.card, AceofSpades.suit);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server live on port ${port}`));
