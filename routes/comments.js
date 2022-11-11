var express = require('express');
var router = express.Router();

const CommentController = require('../controllers/comment.controller.js');

router.post('/post', function(req, res, next){
    new CommentController().post_comment(req, res);
});

router.post('/delete', function(req, res, next){
    new CommentController().delete_post(req, res);
})

module.exports = router;