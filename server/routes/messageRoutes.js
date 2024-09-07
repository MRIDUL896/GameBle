const express = require('express');
const protectRoute = require('../middlewaares/protectRoute');
const {sendMessage, recieveMessage} = require('../controllers/messageController')
const messageRoutes = express.Router();

messageRoutes.post('/sendMessage/:id',protectRoute,sendMessage);
messageRoutes.get('/getMessage/:id',protectRoute,recieveMessage);

module.exports = messageRoutes;