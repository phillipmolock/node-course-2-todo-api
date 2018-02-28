var mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        required: true,
        trim: true,
        minLength: 1,
        type: String
    }
});

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