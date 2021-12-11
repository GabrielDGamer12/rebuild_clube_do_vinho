const { MongoClient } = require('mongodb');

var dbname = "DatabaseCDV";
var dbpass = "jarvis5661330";

const urlDB = `mongodb+srv://gabrieldgamer:${dbpass}@databasecdv.rfh9y.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const clientDB = new MongoClient(urlDB, { useNewUrlParser: true, useUnifiedTopology: true });

console.log("MongoDB Logged");