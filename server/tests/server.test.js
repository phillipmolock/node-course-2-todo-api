// 3rd party
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


// local 
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo',(done) =>{
        var text = 'test text';
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
        
    }); 
    
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });        
    });
    
});

// confirm you're getting 2 elements in todos array which are the 2 we entered 
describe('GET /todos',() => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=> {
            expect(res.body.todos.length).toBe(2);
        }).end(done);
    
        });


    });

// get /todos/:id 

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            console.log(res.body);
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    
    //
    it('should return a 404 if todo not found', (done) => {
        
        request(app)
        .get(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done);
    });
    //
    it('should return a 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123abc`)
        .expect(404)
        .end(done);
    }); // /todo/123
    
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
        
    });
    
    it('should return 404 if todo not found', (done) => {            
        request(app)
        .delete(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done);
    });
    
    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`/todos/123abc`)
        .expect(404)
        .end(done); 
    });
    
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        
        var id = todos[0]._id.toHexString();
        var text = 'This should be the new text';
        
        // update text, set completed true
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
        // assertion: status = 200
        // assertion: response body text is changed
        // assertion: completedAt is a number .toBeANumber
        
        
    });
    
    it('should clear compeltedAt when todo is not completed', (done) => {
        // grab id of second item
        var id = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';
        
        // update text, set completed true
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
        
        // set completed to false
        
        //assertion: status = 200
        //assertion: response body text is changed
        //assertion: completed is now false
        //assertion: completedAt is now null .toNotExist()
        
        
    });
        
});