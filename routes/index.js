var express = require('express');
var router = express.Router();

const UserController = require('../controllers/user.controller.js');
const MessageController = require('../controllers/message.controller.js');

router.get('/', function(req, res, next) {
  new UserController().login(req, res);
});

router.get('/dashboard', function(req, res, next){
  new MessageController().dashboard(req, res);
});

router.get('/logout', function(req, res, next){
  new UserController().logout(req, res);
});

module.exports = router;