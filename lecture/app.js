const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { bookResolvers, bookTypeDefs } = require("./schemas/book");
const PORT = process.env.PORT || 4000;
const { mongoConnect } = require("./config/mongoConnection");
const { productTypeDefs, productResolvers } = require("./schemas/products");
const { userTypeDefs, userResolvers } = require("./schemas/user");

const server = new ApolloServer({
  typeDefs: [bookTypeDefs, productTypeDefs, userTypeDefs],
  resolvers: [bookResolvers, productResolvers, userResolvers],
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
          auth: () => {
            return "Context Auth dijalankan";
          },
        };
      },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
})();
