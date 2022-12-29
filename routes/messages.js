var express = require('express');
var router = express.Router();

const MessageController = require('../controllers/message.controller');

router.post('/post', function(req, res, next){
    new MessageController().insertMessage(req, res)
});

router.post('/delete', function(req, res, next){
    new MessageController().deleteMessage(req, res)
});
  

module.exports = router;