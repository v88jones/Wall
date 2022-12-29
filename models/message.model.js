const mysql = require('mysql');
const Model = require('./model.js');


class MessageModel extends Model {
    constructor(){
        super();
    }

    async getMessage(){
        let response = {status: false, data: {}};

        let get_message_query = mysql.format(`
            SELECT messages.id AS message_id, user_id, CONCAT(first_name, ' ', last_name) AS full_name, message, DATE_FORMAT(messages.created_at, '%M %d, %Y %h:%m:%s %p') AS created_at, DATE_ADD(messages.created_at, INTERVAL 15 MINUTE) > NOW() AS show_delete, comment_data
            FROM messages
            INNER JOIN users ON users.id = messages.user_id
            LEFT JOIN (
                SELECT ANY_VALUE(message_id) AS message_id, JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "comment_id", comments.id, 
                        "user_id", user_id,
                        "full_name", CONCAT(first_name, ' ', last_name),
                        "comment", comment,
                        "created_at", DATE_FORMAT(comments.created_at,'%M %d, %Y %h:%m:%s %p'), 
                        "show_delete", DATE_ADD(comments.created_at, INTERVAL 15 MINUTE) > NOW()
                    )
                ) AS comment_data
                FROM comments
                INNER JOIN users ON users.id = comments.user_id
                GROUP BY comments.message_id
            ) AS new_comments ON new_comments.message_id = messages.id
            ORDER BY messages.id DESC
        `);
        let get_message_query_result = await this.executeQuery(get_message_query);

        if(get_message_query_result){
            response.status = true;
            response.data.messages = get_message_query_result;
        }

        return response;
    }

    async insertMessage(current_user, params){
        let response = {status: false, data: {}};

        let is_message = parseInt(params.is_message);
        delete params.is_message;

        if(current_user && (params.message || params.comment)){
            let insert_message_query = mysql.format(`INSERT INTO ${is_message ? 'messages' : 'comments'} SET ?, created_at = NOW(), updated_at = NOW();`,[{user_id: current_user.id, ...params}])
            let insert_message_query_result = await this.executeQuery(insert_message_query);

            if(insert_message_query_result){
                response.status = true;
            }
            else{
                response.message = `Failed to create ${is_message ? 'messages' : 'comments'} record! Please try again.`
            }
        }
        else{
            response.message = `Required ${is_message ? 'messages' : 'comments'} parameters are missing! Please try again.`
        }

        return response;
    }
    
    async deleteMessage(current_user, params){
        let response = {status: false, data: {}};

        let is_message = parseInt(params.is_message);
        delete params.is_message;

        if(current_user && (params.id)){
            let delete_message_query = mysql.format(`DELETE FROM ${is_message ? 'messages' : 'comments'} WHERE id = ?;`,[params.id])
            let delete_message_query_result = await this.executeQuery(delete_message_query);

            if(delete_message_query_result){
                response.status = true;
            }
            else{
                response.message = `Failed to delete ${is_message ? 'messages' : 'comments'} record! Please try again.`
            }
        }
        else{
            response.message = `Required ${is_message ? 'messages' : 'comments'} parameters are missing! Please try again.`
        }

        return response;
    }
}

module.exports = MessageModel;