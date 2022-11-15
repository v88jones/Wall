const mysql = require('mysql');
const Model = require("./model");

class CommentModel extends Model{
    constructor(){
        super();
    }

    async fetchComment(comment_id = null, is_json_format = false){
        let response = {status: false, data: {}};
        let where_sql = comment_id ? `WHERE comments.id = ?` : "";
        let where_value = comment_id ? [comment_id] : []

        let fetch_comment_query = is_json_format ?
        mysql.format(`
        SELECT JSON_OBJECTAGG(message_id, comment_arr) AS comments_json
        FROM (
            SELECT message_id, JSON_ARRAYAGG(
                JSON_OBJECT(
                    'comment_id', comments.id,
                    'user_id', user_id,
                    'message_id', message_id,
                    'full_name', CONCAT(first_name, ' ', last_name),
                    'comment', comment,
                    'posted_date', DATE_FORMAT(comments.created_at, '%M %D, %Y, %r'),
                    'show_delete', (DATE_ADD(comments.created_at, INTERVAL 30 MINUTE) > NOW())
                )
            ) AS comment_arr
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            GROUP BY message_id
        ) AS new_comments;`)
        : mysql.format(`
            SELECT comments.id AS comment_id, user_id, CONCAT(first_name, ' ', last_name) AS full_name, message_id, comment, DATE_FORMAT(comments.created_at, '%M %D, %Y, %r') AS posted_date, (DATE_ADD(comments.created_at, INTERVAL 30 MINUTE) > NOW()) AS show_delete
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            ${where_sql}`,
            where_value
        )
        let fetch_comment_query_result = await this.executeQuery(fetch_comment_query);

        if(fetch_comment_query_result){
            response.status = true;
            response.data.comments = is_json_format ? JSON.parse(fetch_comment_query_result[0].comments_json) : fetch_comment_query_result;
        }

        return response;
    }

    async insertComment(params, current_user){
        let response = {status: false, data: {}};
        let {message_id, comment} = params;

        if(comment && current_user){
            let insert_comment_query = mysql.format(`INSERT INTO comments SET ?, created_at = NOW(), updated_at = NOW();`,[{message_id, comment, user_id: current_user.id}]);
            let insert_comment_query_result = await this.executeQuery(insert_comment_query);

            if(insert_comment_query_result.insertId){
                response = await this.fetchComment(insert_comment_query_result.insertId);
            }
        }

        return response;
    }

    async deleteComment(params, current_user){
        let response = {status: false, data: {}};
        let {comment_id, message_id} = params;
        let where_sql = comment_id ? 'id = ?' : message_id ? 'message_id = ?' : '';
        let where_value = comment_id ? [comment_id] : message_id ? [message_id] : [];

        if(current_user && (comment_id || message_id)){
            let delete_comment_query = mysql.format(`DELETE FROM comments WHERE ${where_sql};`, where_value);
            let delete_comment_query_result = await this.executeQuery(delete_comment_query);

            if(delete_comment_query_result.affectedRows){
                response.status = true;
            }
        }

        return response
    }
}

module.exports = CommentModel;