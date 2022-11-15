const ejs = require('ejs');
const path = require('path');

const MessageModel = require('../models/message.model.js');
const CommentModel = require('../models/comment.model.js');

class MessageController{
    async dashboard(req, res){
        let {current_user} = req.session;

        if(current_user){
            let messages = []
            let comments = []
            
            let messageModel = new MessageModel();
            let fetch_message_result = await messageModel.fetchMessage();

            if(fetch_message_result.status){
                messages = fetch_message_result.data.messages;
            }
            
            let commentModel = new CommentModel();
            let fetch_comment_result = await commentModel.fetchComment(null, true);
            
            if(fetch_comment_result.status){
                comments = fetch_comment_result.data.comments;
            }

            res.render('dashboard', {messages, comments, current_user});
        }else{
            res.redirect('/');
        }
    }

    async post_message(req, res){
        let params = req.body;
        let {current_user} = req.session;
        let messageModel = new MessageModel();

        let post_message_result = await messageModel.insertMessage(params, current_user);
        
        if(post_message_result.status){
            let {messages} = post_message_result.data;
            let message_html = await ejs.renderFile(
                path.join(__dirname, '../views/partials/message.ejs'),
                {messages, comments: null},
                {async: true}
            );
            post_message_result.html = message_html;
        }

        res.json(post_message_result);
    }
}

module.exports = MessageController;