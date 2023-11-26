require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const books = require("./data/books.json");
const PORT = process.env.PORT || 4000;
const mongoConnection = require("./config/mongoConnection");
const Product = require("./model/product");

const typeDefs = `#graphql
  type Book {
    id: ID
    title: String
    author: String
  }

  type Product {
    _id: ID
    name: String
    price: Int
    stock: Int
    mainImgUrl: String
    imgUrls: [String] 
  }

  input ProductDto {
    name: String!
    price: Int!
    stock: Int!
    mainImgUrl: String!
    imgUrls: [String]
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(payload: ProductDto): Product
    updateProduct(id: ID!, payload: ProductDto): Product
    addImgProduct(id: ID!, imgUrl: String!): Product
    deleteProduct(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => {
      const book = books.find((val) => val.id == id);
      return book;
    },
    products: async () => {
      try {
        const products = await Product.findAll();

        return products;
      } catch (error) {
        throw error;
      }
    },
    product: async (_, { id }) => {
      try {
        const product = await Product.findOne(id);

        return product;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createProduct: async (_, { payload }) => {
      try {
        const newProduct = await Product.create(payload);

        return newProduct;
      } catch (error) {
        throw error;
      }
    },
    updateProduct: async (_, { id, payload }) => {
      try {
        const product = await Product.updateOne(id, payload);

        return product;
      } catch (error) {
        throw error;
      }
    },
    addImgProduct: async (_, { id, imgUrl }) => {
      try {
        const product = await Product.upsertImgUrls(id, imgUrl);

        return product;
      } catch (error) {
        throw error;
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        await Product.delete(id);

        return `Successfully deleted product with id ${id}`;
      } catch (error) {
        throw error;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
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
