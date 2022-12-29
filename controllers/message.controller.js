const MessageModel = require('../models/message.model.js');

class MessageController {
    async dashboard(req, res){
        let {current_user} = req.session;

        if(current_user){
            let messageModel = new MessageModel();
            let {data: {messages}} = await messageModel.getMessage();

            res.render('dashboard', {current_user, messages});
        }
        else{
            res.redirect('/');
        }
    }

    async insertMessage(req, res){
        let params = req.body;
        let {current_user} = req.session;

        let messageModel = new MessageModel();
        res.json(await messageModel.insertMessage(current_user, params))
    }

    async deleteMessage(req, res){
        let params = req.body;
        let {current_user} = req.session;
        
        let messageModel = new MessageModel();
        res.json(await messageModel.deleteMessage(current_user, params))
    }
}

module.exports = MessageController;