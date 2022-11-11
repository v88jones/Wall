const UserModel = require('../models/user.model.js');

class UserController{
    async login(req, res){
        let {current_user} = req.session;

        if(current_user){
            res.redirect('/dashboard');
        }
        else{
            res.render('login');
        }
    }

    async authenticate(req, res){
        let params = req.body;
        let userModel = new UserModel();

        let authenticate_user_result = await userModel.authenticate_user(params);

        if(authenticate_user_result.status){
            let {user} = authenticate_user_result.data;
            req.session.current_user = user;
        }

        res.json(authenticate_user_result);
    }

    async register(req, res){
        let params = req.body;
        let userModel = new UserModel();

        res.json(await userModel.insert_user(params));
    }

    async logout(req, res){
        req.session.destroy();
        res.redirect('/');
    }
}

module.exports = UserController;