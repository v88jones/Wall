const mysql = require('mysql');

const Model = require('./model.js');

class UserModel extends Model{
    constructor(){
        super();
    }

    async fetch_user_by_email_address(email_address){
        let response = {status: false, data: {}};

        let fetch_user_query = mysql.format(`SELECT * FROM users WHERE ?;`, [{email_address}]);
        let [fetch_user_query_result] = await this.executeQuery(fetch_user_query);

        if(fetch_user_query_result){
            response.status = true;
            response.data.user = fetch_user_query_result;
        }

        return response;
    }

    async authenticate_user(params){
        let response = {status: false, data: {}, message: 'User not found!'};
        let {email_address, password} = params;

        if(email_address && password){
            let fetch_user_result = await this.fetch_user_by_email_address(email_address);

            if(fetch_user_result.status){
                let {user} = fetch_user_result.data;
                let encrypted_pw = await this.encrypt_password(password);

                if(user.password === encrypted_pw){
                    response.status = true;
                    response.data.user = user;
                }
            }
        }

        return response;
    }

    async insert_user(params){
        let response = {status: false, data: {}};
        let {first_name, last_name, email_address, password, confirm_password} = params;
        let validate_login_result = await this.validate_login_params({first_name, last_name, email_address, password, confirm_password});

        if(validate_login_result.status){
            let new_params = validate_login_result.data;
            let fetch_user_result = await this.fetch_user_by_email_address(new_params.email_address);

            if(!fetch_user_result.status){
                let insert_user_query = mysql.format(`INSERT INTO users SET ?, created_at = NOW(), updated_at = NOW();`, [new_params]);
                let insert_user_query_result = await this.executeQuery(insert_user_query);

                if(insert_user_query_result.insertId){
                    response.status = true;
                    response.message = 'The account was successfully created!';
                }
                else{
                    response.message = 'Account creation fail!';
                }
            }
            else{
                response.message = 'The email address is already taken!';
            }
        }
        else{
            response.message = validate_login_result.message;
        }

        return response;
    }
}

module.exports = UserModel;