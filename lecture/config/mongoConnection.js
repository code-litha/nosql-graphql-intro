require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const url = process.env.MONGODB_URI;
// console.log(url, "<<< url");

const client = new MongoClient(url);

// Database Name
const dbName = "db_bsd_11";
let database;

async function mongoConnect() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to MongoDB Server");
    database = client.db(dbName); // harus ke passing value db ini ke setiap schema

    // console.log(database, "<<< database di mongoConnect");
    return database;
  } catch (error) {
    console.log(error, "<<< error");
    throw error;
  }
}

function getDatabase() {
  return database;
}

module.exports = {
  mongoConnect,
  database, // value dapat dari mana ?
  getDatabase,
};
