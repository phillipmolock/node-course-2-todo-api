const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        minLength: 1,
        type: String,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    },'abc123').toString();
    
    user.tokens = user.tokens.concat([{access, token}]);
    
    return user.save().then(() => {
        return token;
    });

};

UserSchema.methods.removeToken = function (token) {
  var user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

// statics = model methods instead of instance, instance get called with actual document as this binding, model get called with the model as the this binding

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject(); // this will reject promise causing the .catch to catch an error and return a 401 (meaning that the token was invalid)
    }
    
    return User.findOne({
        // need quotes to do .notation
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'        
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    // find email first then compare hashed/salted password
    
    var User = this;
    
    return User.findOne({email}).then((user)=> {
        if(!user){
            return Promise.reject();
        }
        
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                } else {
                    console.log('wrong pass, reported to NSA');
                    reject();
                }
            })
            
        });
    });
};

UserSchema.pre('save',function (next) {
    var user = this;
    
    if(user.isModified('password')){
       //only want to encrypt pass if it was modified
       
       //user.password
       bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save().then();
                next();
            });
        });
        
       } else {
        next();
       }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}


//var newUser = new User({
//    email: 'philly.b@phillyg.com'
//});
//
//newUser.save().then((doc) => {
//    console.log('Saved user', doc);
//},(e) => {
//   console.log('Unable to save user', e) ;
//});