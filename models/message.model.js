const mysql = require('mysql');
const Model = require('./model');

class MessageModel extends Model{
    constructor(){
        super();
    }

    async fetch_messages(message_id = null){
        let response = {status: false, data: {}};
        let where_sql = message_id ? 'WHERE messages.id = ?' : '';
        let where_value = message_id ? [message_id] : []

        let fetch_messages_query = mysql.format(`
            SELECT user_id, messages.id AS message_id, first_name, last_name, message, DATE_FORMAT(messages.created_at, '%M %D, %Y %r') AS posted_date
            FROM messages
            INNER JOIN users ON users.id = messages.user_id
            ${where_sql}
            ORDER BY messages.id DESC;`, where_value
        )

        let fetch_messages_query_result = await this.executeQuery(fetch_messages_query);

        if(fetch_messages_query_result){
            response.status = true;
            response.data.messages = fetch_messages_query_result;
        }

        return response;
    }

    async insert_message(params, current_user){
        let response = {status: false, data: {}};
        
        if(params.message && current_user.id){
            let insert_message_query = mysql.format(`
                INSERT INTO messages SET ?, created_at = NOW(), updated_at = NOW();`,
                [{user_id: current_user.id, message: params.message}]
            );
            let insert_message_query_result = await this.executeQuery(insert_message_query);

            if(insert_message_query_result.insertId){
                response = await this.fetch_messages(insert_message_query_result.insertId);
            }
        }

        return response;
    }

}

module.exports = MessageModel;