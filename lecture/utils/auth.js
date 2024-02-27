const { GraphQLError } = require("graphql");
const { verifyToken } = require("./jwt");
const { findUserById } = require("../model/user");

const authentication = async (req) => {
  // console.log(req, "<<< req di context auth");
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
  // console.log(authorization, "<<< authorization");

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  const decodedToken = verifyToken(token);

  console.log(decodedToken);

  const user = await findUserById(decodedToken.id);

  if (!user) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return {
    userId: user._id,
    username: user.username,
    userEmail: user.email,
  };
};

module.exports = authentication;
