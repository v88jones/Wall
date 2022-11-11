var express = require('express');
var router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/authenticate', function(req, res, next) {
  new UserController().authenticate(req, res);
});

router.post('/register', function(req, res, next){
  new UserController().register(req, res);
});

module.exports = router;