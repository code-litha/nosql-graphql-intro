require("dotenv").config();
const { mongoConnect } = require("./config/mongoConnect");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { bookResolvers, bookTypeDefs } = require("./schemas/book");
const { responseTypeDefs } = require("./schemas/response");
const { productTypeDefs, productResolvers } = require("./schemas/products");
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs: [bookTypeDefs, responseTypeDefs, productTypeDefs],
  resolvers: [bookResolvers, productResolvers],
  // introspection: true, // ini buat nanti pas deploy aja
});

(async () => {
  try {
    await mongoConnect();
    const { url } = await startStandaloneServer(server, {
      listen: {
        port: PORT,
      },
      context: async ({ req, res }) => {
        return {
          // authentication: () => {
          //   throw new GraphQLError("User is not authenticated", {
          //     extensions: {
          //       code: "UNAUTHENTICATED",
          //       http: { status: 401 },
          //     },
          //   });
          // },
        };
      },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
})();
