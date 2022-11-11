const path = require('path');
const ejs = require('ejs');
const CommentModel = require('../models/comment.model.js');

class CommentController{
    async post_comment(req, res){
        let params = req.body;
        let {current_user} = req.session;
        let commentModel = new CommentModel();

        let insert_comment_result = await commentModel.insert_comment(params, current_user);

        if(insert_comment_result.status){
            let {comments} = insert_comment_result.data;

            let comment_html = await ejs.renderFile(
                path.join(__dirname, '../views/partials/comment.ejs'),
                {comments, current_user},
                {async: true}
            );

            insert_comment_result.html = comment_html
        }

        res.json(insert_comment_result);
    }

    async delete_post(req, res){
        let params = req.body;
        let {current_user} = req.session;
        let commentModel = new CommentModel();

        res.json(await commentModel.delete_comment(params.comment_id, current_user));
    }
}

module.exports = CommentController;