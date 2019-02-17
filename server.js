const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const registration = require('./registration');
const ioServer = require('./common/io');

app.use(express.json());
app.use(cors());

app.use('/api/registration', registration);

ioServer.start(io);

module.exports = server;
