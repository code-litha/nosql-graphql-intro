const { GraphQLError } = require("graphql");
const { getDatabase } = require("../config/db");
const books = require("../data/books.json");
const { ObjectId } = require("mongodb");
const Product = require("../model/product");

const typeDefs = `#graphql
  type Book {
    id: ID
    title: String
    author: String
  }

  type Product {
    _id: ID
    name: String
    stock: Int
    price: Int
  }

  input ProductCreateInput {
    name: String!
    stock: Int!
    price: Int!
  }

  type Query {
    books: ResponseBook
    book(id: ID!): ResponseBook
    products: ResponseProduct
    product(id: ID!): Product
  }

  type Mutation {
    productCreate(input: ProductCreateInput): ResponseCreateProduct
    productUpdate(input: ProductCreateInput, id: ID!): ResponseCreateProduct
    productDelete(id: ID!): ResponseCreateProduct
  }
`;

const resolvers = {
  Query: {
    books: () => {
      return {
        statusCode: 200,
        message: `Successfully retrieved books data`,
        data: books,
      };
    },
    book: (_, { id }) => {
      const book = books.find((val) => val.id == id);
      return {
        statusCode: 200,
        message: `Successfully retrieved a book data`,
        data: [book],
      };
    },
    products: async () => {
      try {
        const products = await Product.findAll();
        return {
          statusCode: 200,
          message: `Successfully retrieved products data`,
          data: products,
        };
      } catch (error) {
        throw new GraphQLError("An error while retrieved data products");
      }
    },
    product: async (_, { id }) => {
      try {
        const product = await Product.findOne(id);

        return product;
      } catch (error) {
        throw new GraphQLError("An error while retrieved data product");
      }
    },
  },
  Mutation: {
    productCreate: async (_, args) => {
      try {
        const database = getDatabase();
        const productCollection = database.collection("products");

        const newProduct = await productCollection.insertOne({
          name: args.input.name,
          stock: args.input.stock,
          price: args.input.price,
        });

        console.log(newProduct, "<<< new product");

        const product = await productCollection.findOne({
          _id: new ObjectId(newProduct.insertedId),
        });

        return {
          statusCode: 200,
          message: `Successfully create new product`,
          data: product,
        };
      } catch (error) {
        throw new GraphQLError("An error while create data product");
      }
    },
    productUpdate: async (_, args) => {
      try {
        const database = getDatabase();
        const productCollection = database.collection("products");

        const filterQuery = {
          _id: new ObjectId(args.id),
        };

        const valueUpdated = {
          name: args.input.name,
          stock: args.input.stock,
          price: args.input.price,
        };

        const updateProduct = await productCollection.updateOne(filterQuery, {
          $set: valueUpdated,
        });

        // console.log(updateProduct, "<<< update product");

        const product = await productCollection.findOne({
          _id: new ObjectId(args.id),
        });

        return {
          statusCode: 200,
          message: `Successfully update product`,
          data: product,
        };
      } catch (error) {
        throw new GraphQLError("An error while update data product");
      }
    },
    productDelete: async (_, args) => {
      try {
        const database = getDatabase();
        const productCollection = database.collection("products");

        const deleteProduct = await productCollection.deleteOne({
          _id: new ObjectId(args.id),
        });

        return {
          statusCode: 200,
          message: `Successfully delete product with id ${args.id}`,
        };
      } catch (error) {
        throw new GraphQLError("An error while delete data product");
      }
    },
  },
};

module.exports = {
  bookTypeDefs: typeDefs,
  bookResolvers: resolvers,
};
