const express = require('express');
const router = express.Router();

const MessageController = require('../controllers/message.controller');

router.post('/post', function(req, res, next){
    new MessageController().post_message(req, res);
})

module.exports = router;