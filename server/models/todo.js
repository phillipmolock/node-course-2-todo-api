var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1, 
        trim: true //remove leading or trailing whitespace
    },
    completed: {
        type: Boolean, 
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        
    }
});

module.exports = {
    Todo
}

////model will be your constructor
//
//var newTodo = new Todo({
//    text: 1234 
//});
//
//newTodo.save().then((doc) => {
//console.log('Saved todo', doc);
//}, (e) => {
//   console.log('Unable to save todo', e) ;
//});
//
//var newTodoGym = new Todo({
//   text: 'Go to the gym',
//    completed: true,
//    completedAt: 132
//});
//
//newTodoGym.save().then((doc)=>{
//    console.log('Saved todo', doc);
//},(e)=>{
//    console.log('Unable to save todo', e);
//});
//
//// make new user model email, password, todo's will be associated
//// for now setup email property, require it, trim it, type set to string, min length of 1