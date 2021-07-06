const express = require('express');

const channelsRouter = require('./channels/channels-router')

const server = express();

server.use(express.json());

server.use('/api/posts', channelsRouter)

server.listen(3333, () => console.log('API is running'))