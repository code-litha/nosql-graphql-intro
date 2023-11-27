require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { bookResolvers, bookTypeDefs } = require("./schemas/book");
const { responseTypeDefs } = require("./schemas/response");
const PORT = process.env.PORT || 4000;
const mongoConnection = require("./config/db");

const server = new ApolloServer({
  typeDefs: [bookTypeDefs, responseTypeDefs],
  resolvers: [bookResolvers],
  // introspection: true, // ini buat nanti pas deploy aja
});

(async () => {
  try {
    await mongoConnection.connect();
    const { url } = await startStandaloneServer(server, {
      listen: {
        port: PORT,
      },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
})();
