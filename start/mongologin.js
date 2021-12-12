const { MongoClient } = require('mongodb');
require('dotenv').config()

const urlDB = `mongodb+srv://gabrieldgamer:${process.env.dbpass}@databasecdv.rfh9y.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`;
const clientDB = new MongoClient(urlDB, { useNewUrlParser: true, useUnifiedTopology: true });

clientDB.connect()

const collectionMusic = clientDB.db("cdvDB").collection("cdvMusic");

const collectionConfig = collectionMusic;

const collectionUptime = clientDB.db("cdvDB").collection("cdvUptime");

module.exports = { collectionMusic, collectionConfig, collectionUptime }

console.log("MongoDB Logged");