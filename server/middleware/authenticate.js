const {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
        if (!user){
           return Promise.reject(); //toss out an error to catch 
        }
        
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=> {
        res.status(401).send(); //respond 401 status / empty body
    }); 
};

module.exports = {
    authenticate
};