const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const registration = require('./registration');

app.use(express.json());

app.use('/api/registration', registration);

module.exports = server;
