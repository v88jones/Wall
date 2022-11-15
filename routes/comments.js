const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comment.controller.js');

router.post('/post', function(req, res, next){
    new CommentController().post_comment(req, res);
})

router.post('/delete', function(req, res, next){
    new CommentController().delete_comment(req, res);
})

module.exports = router;