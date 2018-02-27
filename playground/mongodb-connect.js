//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //identical to commented code above

//var obj = new ObjectID();
//console.log(obj);

//var user = {name: 'Phil', age:25};
//var {name} = user; // ES 6 destructuring
//console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
        // using return stops the program from continuing on to success message
    }
    
    console.log('connected to MongoDB server');
    //.find() returns cursor, use .toArray() to create promise, .then() to call promise
    db.collection('Users').find({name:'Dane'}).toArray().then((docs) =>{
        console.log('Users with name: Dane');
        console.log(JSON.stringify(docs, undefined, 2));
    } ,(err) => {
        console.log('Error finding name: Dane in users collections', err);
    });
    
//        db.collection('Todos').find().count().then((count) => {
//        console.log('Todos');
//        console.log(`Todos count: ${count}`);
//    }, (err) =>{
//       console.log('Unable to fetch todos', err) 
//    });
//    
//    db.collection('Todos').find({
//        _id: new ObjectID('5a95694d7e67203c28a9e64a') //have to pass as string to get Object ID
//    }).toArray().then((docs) => {
//        console.log('Todos');
//        console.log(JSON.stringify(docs, undefined, 2));
//    }, (err) =>{
//       console.log('Unable to fetch todos', err) 
//    }); //.toArray() returns promise that we can call .then() on taking success/failure callback functions as arguments
    
//    db.collection('Todos').insertOne({
//        text: 'Something to do',
//        completed: false
//    }, (err, result)=>{
//        if (err){
//            return console.log('Unable to insert todo', err);
//        }
//        
//        console.log(JSON.stringify(result.ops, undefined, 2)); //ops store all docs that were inserted
//    });
    
    // Insert new doc into Users collection {name: dane, age: 30, location: Chicago}
    
//    db.collection('Users').insertOne({
//        name: 'Dane',
//        age: 30,
//        location: 'Chicago'
//    }, (err, result) =>{
//        if (err){
//            return console.log('Unable to insert user', err);
//        }
//        
//        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
//    });
    
    db.close();
});