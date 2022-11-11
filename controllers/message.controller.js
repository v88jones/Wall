const path = require('path');
const ejs = require('ejs');

const MessageModel = require('../models/message.model.js');
const CommentModel = require('../models/comment.model');

class MessageController{
    async dashboard(req, res){
        let {current_user} = req.session;

        if(current_user){
            let messages = [];
            let comments_json = {};

            let messageModel = new MessageModel();
            let fetch_messages_result = await messageModel.fetch_messages();

            if(fetch_messages_result.status){
                messages = fetch_messages_result.data.messages;
            }

            let commentModel = new CommentModel();
            let fetch_comments_result = await commentModel.fetch_comments(null, true);

            if(fetch_comments_result.status){
                comments_json = fetch_comments_result.data.comments;
            }

            res.render('dashboard', {current_user, messages, comments_json});
        }
        else{
            res.redirect('/');
        }
    }

    async post_message(req, res){
        let params = req.body;
        let messageModel = new MessageModel();

        let insert_message_result = await messageModel.insert_message(params, req.session.current_user);

        if(insert_message_result.status){
            let {messages} = insert_message_result.data;

            let message_html = await ejs.renderFile(
                path.join(__dirname, '../views/partials/message.ejs'),
                {messages, comments_json: null},
                {async: true}
            );
            
            insert_message_result.html = message_html;
        }

        res.json(insert_message_result);
    }
}

module.exports = MessageController;