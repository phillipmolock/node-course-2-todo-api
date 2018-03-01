// 3rd party
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// local 
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// dummy array to fill todos after clearing
const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
},{
    _id: new ObjectID(),
    text: 'second test todo'
}];

beforeEach((done) => {
   Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
   }).then(() => done()); 
});

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
