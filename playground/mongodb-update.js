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
    
//    db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID("5a9567c95fb3d931f86d0f81")   
//    }, {
//        $set: {
//            completed: true
//        }
//    },{
//        returnOriginal: false
//    }).then((result) => {
//        console.log(result);
//    });
    
    db.collection('Users').findOneAndUpdate({
     _id: new ObjectID("5a95a324ce4e1b42c8cf301a")   
    },{
        $set: {
            name: 'Milton Friedman'
        },
        $inc: {
            age: 1
        },
        $currentDate: {
            currentDate1: {$type: "timestamp"}
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    
    db.close();
});