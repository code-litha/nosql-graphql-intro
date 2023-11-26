const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const books = require("./data/books.json");
const PORT = process.env.PORT || 4000;

const typeDefs = `#graphql
  type Book {
    id: ID
    title: String
    author: String
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => {
      const book = books.find((val) => val.id == id);
      return book;
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
