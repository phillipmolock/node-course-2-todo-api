//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //identical to commented code above



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    
    console.log('Connected to MongoDB server');
    
    // deleteMany
//    db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) =>{
//        console.log(result);
//    }, (err) => {
//    
//        console.log('Error deleting' , err);
//    });
    
    // deleteOne
//    db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) =>{
//        console.log(result);
//    });
    
    // findOneAndDelete
//    db.collection('Todos').findOneAndDelete({completed: false}).then((result) =>{
//        console.log(result);
//    });
    
    // find duplicates in users, delete many to delete duplicates 
//    db.collection('Users').deleteMany({
//        name: 'Dane'
//    }).then((result) =>{
//        console.log(result);
//    });
    // find and delete a use by _id
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a94cef88ce6591d50dff561')
    }).then((result) =>{
        console.log(JSON.stringify(result, undefined, 2);
    });
    
   db.close();
});