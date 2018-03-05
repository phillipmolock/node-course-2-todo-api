require('./config/config');

// 3rd party requires
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

// local requires
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


// app

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e)=> {
        res.status(400).send(e);
    });
});

// App get request by id /todos/123415, fetch this value to make query

app.get('/todos/:id',(req,res) => {
    // Grab ID from params
    var id = req.params.id;
    
    // confirm it's a valid mongooseDB ID
    if(ObjectID.isValid(id)){
        //res.status(200).send('valid id');
        
        Todo.findById({
            _id: id
        })
        .then((todo) =>{
            if(todo) {
                res.status(200).send({todo});
            } else {
                res.status(404).send('id valid but todo not found');
            }
        })
        .catch((e) => res.status(400).send(e));
        
    } else {
        res.status(404).send('Invalid ID');
    }

    
    // validate ID like in mongoose queries
        // respond with 404 if not valid - send back empty with status 400
    
    // findByID -> success case (if todo, send it back, if no todo, send back 404 with empty body) // and error case (send 400, empty body)
    
    
}, (e) => {
    console.log(e);
});


app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;
    
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        
        res.send({todo});
        
    }).catch((e) => {
        res.status(400).send();
    });

//    if(ObjectID.isValid(id)){
////        Todo.findByIdAndremove({_id: id}).then((todo)=> {
////            if(todo){
////                res.status(200).send({todo});
////            } else {
////                res.status(404).send('Valid ID but no doc', id);
////            }
////            
////        }).catch((e) => {
////            res.status(400).send('Caught error trying to remove ', e);
////        });
//        
//    } else {
//        res.status(404);
//    }
    
    // validate the id

    // if it's not valid, return 404
    
    // remove todo by ID
    
        // success, check if doc came back, if doc send back doc with 200, if no doc, send 404
    
        // error, send 400 with empty body
});

app.patch('/todos/:id', (req, res) => {
   var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    
    
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    if (_.isBoolean(body.completed) && body.completed) {
        //if body.compelted is a boolean AND it's true
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null; 
    }
    
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=> {
        if (!todo) {
            return res.status(404).send();
        }
        
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});


// POST /users

app.post('/users', (req, res) => {
    // read body of response for email/pass/tokens
    var body = _.pick(req.body, ['email', 'password']);
    
    //create new user object with emali/pass/tokens
    
    var user = new User(body);
    
    console.log(user);
    
    user.save().then(() => {
       return user.generateAuthToken();
        //res.send(user); 
    }).then((token)=> {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
    
});

// private routes

app.get('/users/me', authenticate, (req,res) =>{
    res.send(req.user);
});

// create private route middle ware



//app.post('/todos', (req, res) => {
//    console.log(req.body);
//    var todo = new Todo({
//        text: req.body.text
//    });
//    todo.save().then((doc) => {
//        res.send(doc);
//    },(e)=>{
//        res.status(400).send(e);
//    });
//});

// POST /users/login {email, password}

app.post('/users/login', (req, res)=> {
    var body = _.pick(req.body, ['email','password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(()=> {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}