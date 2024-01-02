const {
  getAllProduct,
  getOneProduct,
  createOneProduct,
  updateOneProduct,
  deleteOneProduct,
} = require("../model/product");
const { GraphQLError } = require("graphql");

const typeDefs = `#graphql
  type Product {
    _id: ID
    name: String
    stock: Int
    price: Int
  }

  type Query {
    getProducts: [Product]
    getProductById(id: ID!): Product
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Int!
  }

  input ProductUpdate {
    name: String
    stock: Int
    price: Int
    id: ID!
  }

  type Mutation {
    createProduct(productInput: ProductInput): Product
    updateProduct(productUpdate: ProductUpdate): Product
    deleteProduct(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    getProducts: async (_parent, _args, context) => {
      const products = await getAllProduct();
      return products;
    },
    getProductById: async (_parent, args) => {
      const product = await getOneProduct(args.id);
      return product;
    },
  },
  Mutation: {
    createProduct: async (_parent, args) => {
      const product = await createOneProduct(args.productInput);
      return product;
    },
    updateProduct: async (_parent, args) => {
      const payload = {};

      for (const key in args.productUpdate) {
        if (args.productUpdate[key] && key !== "id") {
          payload[key] = args.productUpdate[key];
        }
      }

      console.log(payload, "<<< payload");
      const product = await updateOneProduct(args.productUpdate.id, payload);

      return product;
    },
    deleteProduct: async (_parent, args) => {
      await deleteOneProduct(args.id);
      return `Successfully delete product with id ${args.id}`;
    },
  },
};

module.exports = {
  productTypeDefs: typeDefs,
  productResolvers: resolvers,
};
