const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
const dbName = "db_bsd_08";

async function connect() {
  try {
    await client.connect();
    console.log("Successfully to connect mongodb");
    return client;
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

function getDatabase() {
  return client.db(dbName);
}

module.exports = {
  connect,
  getDatabase,
};
