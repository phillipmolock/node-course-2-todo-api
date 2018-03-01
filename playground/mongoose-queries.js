const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');


// load in user model {} 

var userId = '5a969e0324d0b290485bb7bb';

User.findById({
    _id: userId
}).then((user)=>{
    if(user){
        console.log('User', JSON.stringify(user, undefined, 2));      
    } else {
        console.log('User not found');
    }
}).catch((e) =>{
    console.log('Error ', e);
});

// query users collection by picked ID, 3 cases: query works but no user, user was found, handle any other errors that might have occurred 

//var id = '5a97f2c111cdc88825a2879e';
//
//if (!ObjectID.isValid(id)){
//    console.log('ID not valid');
//}

// find returns array of objects
//Todo.find({
//    _id: id
//}).then((todos) => {
//    console.log('Todos', todos);
//});
//
//
//// findOne just returns one object
//Todo.findOne({
//    _id: id
//}).then((todo) => {
//    console.log('Todo', todo);
//});

// finById takes ID and returns object
//Todo.findById({
//    _id: id
//}).then((todo) => {
//    if(!todo){
//        return console.log(id, 'not found'); // return to break out of function if todo is null
//    }
//    
//    console.log('Todo by id', todo);
//}).catch((e) => console.log(e));