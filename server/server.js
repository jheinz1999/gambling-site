const express = require('express');
const app = express();
const server = require('http').Server(app);

const registration = require('./registration');
const io = require('./common/io');

app.use(express.json());

app.use('/api/registration', registration);

io.start();

module.exports = server;
