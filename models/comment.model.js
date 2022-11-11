const mysql = require('mysql');
const Model = require('./model');

class CommentModel extends Model{
    constructor(){
        super();
    }
    async fetch_comments(comment_id = null, is_json_format = false){
        let response = {status: false, data: {}};
        let where_sql = comment_id ? 'WHERE comments.id = ?' : '';
        let where_value = comment_id ? [comment_id]: [];

        let comment_query = is_json_format ?
        `SELECT JSON_OBJECTAGG(message_id, comment_arr) AS comments_json
        FROM (
            SELECT message_id, JSON_ARRAYAGG(
                JSON_OBJECT(
                    'comment_id', comments.id,
                    'user_id', user_id,
                    'message_id', message_id,
                    'first_name', first_name,
                    'last_name', last_name,
                    'comment', comment,
                    'posted_date', DATE_FORMAT(comments.created_at, '%M %D, %Y %r'),
                    'show_delete', (DATE_ADD(comments.created_at, INTERVAL 15 MINUTE) > NOW())
                )) AS comment_arr
            FROM comments
            INNER JOIN users ON users.id = comments.user_id
            GROUP BY comments.id
        ) AS new_comments;` :
        `SELECT user_id, message_id, comments.id AS comment_id, first_name, last_name, comment, DATE_FORMAT(comments.created_at, '%M %D, %Y %r') AS posted_date, (DATE_ADD(comments.created_at, INTERVAL 15 MINUTE) > NOW()) AS show_delete
        FROM comments
        INNER JOIN users ON users.id = comments.user_id
        ${where_sql};`

        let fetch_comments_query = mysql.format(comment_query, where_value);
        let fetch_comments_query_result = await this.executeQuery(fetch_comments_query);

        if(fetch_comments_query_result){
            if(is_json_format){
                let [fetch_result] = fetch_comments_query_result
                fetch_comments_query_result = JSON.parse(fetch_result.comments_json);
            }
            response.status = true;
            response.data.comments = fetch_comments_query_result;
        }

        return response;
    }

    async insert_comment(params, current_user){
        let response = {status: false, data:{}};
        let {comment, message_id} = params;
        let {id: user_id} = current_user;

        if(comment && user_id){
            let insert_comment_query = mysql.format(`INSERT INTO comments SET ?, created_at = NOW(), updated_at = NOW()`, [{message_id, user_id, comment}]);
            let insert_comment_query_result = await this.executeQuery(insert_comment_query);

            if(insert_comment_query_result.insertId){
                response = await this.fetch_comments(insert_comment_query_result.insertId);
            }
        }

        return response;
    }

    async delete_comment(comment_id, current_user){
        let response = {status: false, data: {}};

        if(comment_id && current_user.id){
            let delete_comment_query = mysql.format(`
                DELETE FROM comments where id = ? and user_id = ?`,
                [comment_id, current_user.id]
            );
            let delete_comment_query_result = await this.executeQuery(delete_comment_query);

            if(delete_comment_query_result.affectedRows){
                response.status = true;
            }
        }

        return response;
    }
}

module.exports = CommentModel;