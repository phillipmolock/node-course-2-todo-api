// 3rd party requires
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local requires
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


// app

var app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}