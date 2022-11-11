var express = require('express');
var router = express.Router();

const MessageController = require('../controllers/message.controller.js');

router.post('/post', function(req, res, next){
    new MessageController().post_message(req, res);
});

module.exports = router;