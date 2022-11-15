const mysql = require('mysql');
const Model = require('./model');
class MessageModel extends Model{
    constructor(){
        super();
    }

    async fetchMessage(message_id = null){
        let response = {status: false, data: {}};
        let where_sql = message_id ? `WHERE messages.id = ?` : "";
        let where_value = message_id ? [message_id] : [];
        
        let fetch_message_query = mysql.format(`
            SELECT user_id, CONCAT(first_name, ' ', last_name) AS full_name, messages.id AS message_id, message, DATE_FORMAT(messages.created_at, '%M %D, %Y %r') AS posted_date
            FROM messages
            INNER JOIN users ON messages.user_id = users.id
            ${where_sql}`,
            where_value
        );
        let fetch_message_query_result = await this.executeQuery(fetch_message_query);

        if(fetch_message_query_result){
            response.status = true;
            response.data.messages = fetch_message_query_result;
        }

        return response;
    }

    async insertMessage(params, current_user){
        let response = {status: false, data: {}};
        let {message} = params;

        if(message && current_user){
            let insert_message_query = mysql.format(`INSERT INTO messages SET ?, created_at = NOW(), updated_at = NOW();`, [{message, user_id: current_user.id }]);
            let insert_message_query_result = await this.executeQuery(insert_message_query);

            if(insert_message_query_result.insertId){
                response = await this.fetchMessage(insert_message_query_result.insertId);
            }
        }

        return response;
    }
}

module.exports = MessageModel