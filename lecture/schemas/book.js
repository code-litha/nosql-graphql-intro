const books = require("../data/books.json");

const typeDefs = `#graphql
  type Book {
    id: ID
    title: String
    author: String
  }

  type Query {
    books: ResponseBook
    book(id: ID!): ResponseBook
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
  },
};

module.exports = {
  bookTypeDefs: typeDefs,
  bookResolvers: resolvers,
};
