require("dotenv").config();
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URL;
const dbName = "db_ecommerce";

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Successfully to connect mongodb");

    return client;
  } catch (error) {
    await client.close();
    throw error;
  }
}

function getDatabase() {
  return client.db(dbName);
}

module.exports = {
  connect,
  getDatabase,
};
