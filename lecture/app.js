const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { bookResolvers, bookTypeDefs } = require("./schemas/book");
const PORT = process.env.PORT || 3000;
const { mongoConnect } = require("./config/mongoConnection");
const { productTypeDefs, productResolvers } = require("./schemas/products");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const authentication = require("./utils/auth");
const { orderTypeDefs, orderResolvers } = require("./schemas/order");

const server = new ApolloServer({
  typeDefs: [bookTypeDefs, productTypeDefs, userTypeDefs, orderTypeDefs],
  resolvers: [bookResolvers, productResolvers, userResolvers, orderResolvers],
});

(async () => {
  try {
    await mongoConnect();
    const { url } = await startStandaloneServer(server, {
      listen: {
        port: PORT,
      },
      context: async ({ req, res }) => {
        // console.log(req, "<<< req");
        // console.log("ini context berjalan");
        return {
          auth: async () => {
            return await authentication(req);
          },
        };
      },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
})();
