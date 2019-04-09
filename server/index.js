const express = require('express');
require('dotenv').config();

const server = require('./server');

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server live on port ${port}`));
