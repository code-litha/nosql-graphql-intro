const { ObjectId } = require("mongodb");
const { getDatabase, client } = require("../config/mongoConnection");
const { GraphQLError } = require("graphql");

const typeDefs = `#graphql
  type Order {
    _id: ID
    productId: ID
    userId: ID
    qty: Int
    price: Int 
    totalPrice: Int
  }

  type Mutation {
    createOrder(productId: ID!, qty: Int!): Order
  }
`;

const resolvers = {
  Mutation: {
    createOrder: async (_, args, contextValue) => {
      const session = client.startSession();
      try {
        session.startTransaction();
        const { userId } = await contextValue.auth();

        console.log(args, "<<< args");

        // const database = getDatabase();
        const database = client.db("db_bsd_11");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("orders");

        const product = await productCollection.findOne(
          {
            _id: new ObjectId(args.productId),
          },
          {
            session,
          }
        );

        if (!product) {
          throw new Error("Product Not Found");
        }

        if (product.stock < args.qty) {
          throw new Error("Out of Stock");
        }

        const newOrder = await orderCollection.insertOne(
          {
            productId: new ObjectId(args.productId),
            qty: args.qty,
            userId: new ObjectId(userId),
            price: product.price,
            totalPrice: product.price * args.qty,
          },
          { session }
        );

        await productCollection.updateOne(
          {
            _id: product._id,
          },
          {
            $set: {
              stock: product.stock - args.qty,
            },
          },
          { session }
        );

        await session.commitTransaction();

        const order = await orderCollection.findOne({
          _id: new ObjectId(newOrder.insertedId),
        });

        return order;
      } catch (error) {
        await session.abortTransaction();
        throw new GraphQLError(
          error?.message || "An error occured while create order",
          {
            extensions: {
              http: {
                status: 400,
              },
            },
          }
        );
      } finally {
        await session.endSession();
      }
    },
  },
};

module.exports = {
  orderTypeDefs: typeDefs,
  orderResolvers: resolvers,
};
