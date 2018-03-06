// 3rd party
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


// local 
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo',(done) =>{
        var text = 'test text';
        
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=> {
            expect(res.body.todos.length).toBe(1);
        }).end(done);
    
        });


    });

// get /todos/:id 

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            console.log(res.body);
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    
    it('should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });    
    
    //
    it('should return a 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    //
    it('should return a 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123abc`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    }); // /todo/123
    
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
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

    it('should not remove a todo I dont own', (done) => {
        var hexId = todos[0]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toExist();
                done();
            }).catch((e) => done(e));
        });
        
    });    
    
    it('should return 404 if todo not found', (done) => {            
        request(app)
        .delete(`/todos/${new ObjectID()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
    
    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`/todos/123abc`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done); 
    });
    
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        
        var id = todos[0]._id.toHexString();
        var text = 'This should be the new text';
        // auth as first user
        
        // update text, set completed true
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
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
    
    // dup above
    // try to update first todo as second user
    // should be 404
    
    it('shouldnt update the todo as unauth user', (done) => {
        // grab id of first item
        
        var id = todos[0]._id.toHexString();
        var text = 'This should be the new text';
        // auth as first user
        
        // update text, set completed true
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            text,
            completed: true
        })
        .expect(404)
        .end(done);
        
        
    });    
    
    it('should clear compeltedAt when todo is not completed', (done) => {
        // grab id of second item
        var id = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';
        
        // update text, set completed true
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
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


// test users auth

describe('GET /users/me', () => {
   
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
           expect(res.body._id).toBe(users[0]._id.toHexString()); 
            expect(res.body.email).toBe(users[0].email);
        }).end(done);
        
    });
    
    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=> {
            expect(res.body).toEqual({});
        }).end(done);
        // 401
        
        // body empty object
    });
    
});


describe('POST /users', () => {
    it('should create a user', (done) => {
       var email = 'example@example.com';
        var password = '123mnb!';
        
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        }).end((err)=> {
            if (err) {
                return done(err);
            }
            
            User.findOne({email}).then((user) => {
               expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });
    
    it('should return validation errors if request invalid', (done) => {
        // expect 400
        request(app)
        .post('/users')
        .send({
            email: 'and',
            password: '123'
        })
        .expect(400)
        .end(done);
        
    });
    
    it('should not create user if email in user', (done) => {
        // sign up with duplicate email
        // expect 400
        var email = users[0].email;
        var password = users[0].password;
        
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
    
});

describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
       request(app)
       .post('/users/login')
       .send({email: users[1].email, password: users[1].password})
       .expect(200)
       .expect((res) => {
           expect(res.header['x-auth']).toExist();
       })
       .end((err, res) => {
           if (err){
               return done(err);
           }
           
           User.findById(users[1]._id).then((user)=> {
               expect(user.tokens[1]).toInclude({
                   access: 'auth',
                   token: res.headers['x-auth']
               });
               done();
           }).catch((e) => done(e));
       })
       
   });
    
    it('should reject invalid login', (done) => {
        //invalid password, then tweak assertions
        request(app)
       .post('/users/login')
       .send({email: users[1].email, password: 'incorrect'})
       .expect(400)
       .expect((res) => {
           expect(res.header['x-auth']).toNotExist();
       })
       .end((err, res) => {
           if (err){
               return done(err);
           }
           
           User.findById(users[1]._id).then((user)=> {
               expect(user.tokens.length).toBe(1);
               done();
           }).catch((e) => done(e));
       })
    });
});

describe('DELETE /users/me/token',()=>{
    it('should remove token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));
        });
    });
});