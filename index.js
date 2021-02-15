const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const ObjectId = require("mongodb").ObjectID;
const dbSchema = require("./schema/db-schema");

const constants = require("./common/constants");
const messages = require("./common/messages");

const tokenFactory = require("./security/token-factory");

const bhagavadGitaDB = require("./db/bhagavad-gita-db");

const app = express();
const port = process.env.PORT || constants.LOCALHOST_PORT;

// No access without a valid access token (one received after calling calling /oauth2/v1/ route)
app.use(require("./middlewares/auth"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/auth/oauth/v1/token/", (req, res) => {
  res.status(401).json({
    message: messages.TOKEN_GEN_ACCESS_ERRROR,
  });
});

app.post("/auth/oauth/v1/token", (req, res) => {
  if (
    !req.body.client_id ||
    req.body.client_id.length !== 24 ||
    !req.body.client_secret ||
    req.body.client_secret.length !== 24
  ) {
    res.status(401).json({
      message: messages.TOKEN_GEN_INVALID_PARAMS,
    });
    return;
  }

  bhagavadGitaDB
    .findInCollectionByQuery(bhagavadGitaDB.COLLECTIONS.CLIENTS, {
      _id: ObjectId(req.body.client_id),
      secret: ObjectId(req.body.client_secret),
    })
    .then((client) => {
      if (!client) {
        res.status(401).json({
          message: messages.TOKEN_GEN_INVALID_CLIENT,
        });
      } else {
        if (!client.authorized) {
          res.status(401).json({
            message: messages.TOKEN_GEN_NOT_AUTHORIZED,
          });
        } else {
          // generate a token and send that token in response
          res.status(200).json({
            token: tokenFactory.generateToken(client._id),
          });
        }
      }
    });
});

app.use(
  "/api/graphql/v1",
  graphqlHTTP({
    schema: dbSchema,
    graphiql: true,
  })
);

app.get("/api/rest/v1", (req, res) => {
  res.status(200).json({
    message:
      "This REST API works but we recommend using GraphQL one via /api/graphql/v1",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hare Krishna !!!" });
});

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
