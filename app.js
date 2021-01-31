const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const dbSchema = require("./schema/db-schema");

const app = express();
const port = process.env.PORT || 3000;

// No access without a valid access token
app.use(require("./middlewares/auth"));

app.use(
  "/graphql/v1",
  graphqlHTTP({
    schema: dbSchema,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.json("Hare Krishna");
});

app.listen(port, () => {
  console.log(`Express server running on port: ${port}`);
});
