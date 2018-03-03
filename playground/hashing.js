//const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//bcrypt.genSalt(10, (err, salt) => {
//    bcrypt.hash(password, salt, (err, hash) => {
//        console.log(hash);
//    }); // .hash(password, salt, callback)
//}); //.genSalt (rounds, callback)

var hashedPassword = '$2a$10$WmmLTrajlXwiZ5y7D17Vqeb0kB.SgVTaAD0X1qAQp6RaIuNHA9XMm';

bcrypt.compare(password, hashedPassword, (err, res) => {
   console.log(res); 
});

//var data = {
//  id: 10  
//};
//
//var token = jwt.sign(data, '123'); //header.payload.hash = how token is setup
////jwt.verify
//
//console.log('token', token);
//
//var decoded = jwt.verify(token, '123');
//console.log('decoded', decoded);



//var message = 'I am user number 3';
//
//var hash = SHA256(message).toString();
//console.log(`Message: ${message} -> Hash: ${hash}`);
//
//var data = {
//    id: 4
//};
//
//var token = {
//    data,
//    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
//};
//
//// salt = adding some secret before hashing so can't recreate hash and send to us
//
//console.log(data);
//console.log(token);
//
////token.data.id = 5;
////token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
//if (resultHash === token.hash) {
//    console.log('Data was not changed');
//} else {
//    console.log('Data was changed, don\'t trust');
//}