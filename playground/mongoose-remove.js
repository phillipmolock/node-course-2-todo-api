const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

// Todo.remove

//Todo.remove({}).then((result) => {
//    console.log(result);
//});

//Todo.findByIdAndRemove('5a98630d4102a6163e4febb2').then((todo) => {
//    console.log(todo);
//});

Todo.findOneAndRemove({_id: '5a9863c34102a6163e4febdd'}).then((todo) => {
    console.log(todo);
});