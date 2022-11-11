const MD5 = require('md5');

const database = require('../config/database');

class Model{
    async encrypt_password(password){
        return MD5(`walling_${password}_walling`);
    }

    async executeQuery(query){
        return new Promise((resolve, reject) => {
            database.query(query, function(err, result){
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async validate_login_params(params){
        let response = {status: false, data: {}};
        
        let params_keys = Object.keys(params);

        for(let index in params_keys){
            let key = params_keys[index];

            if(!params[key]){
                response.message = 'Some fields are empty!';
            }
            else if(key === 'password'){
                if(params.password !== params.confirm_password){
                    response.message = 'Password does not match!';
                }
                else if(params.password.length < 6){
                    response.message = 'Password must be atleast 6 character long!';
                }
            }

            if(response.message){
                break;
            }
        }

        if(!response.message){
            delete params.confirm_password;
            params.password = await this.encrypt_password(params.password);

            response.status = true;
            response.data = params;
        }

        return response;
    }
}

module.exports = Model;