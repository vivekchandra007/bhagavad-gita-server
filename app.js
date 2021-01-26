const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const dbSchema = require("./schema/db-schema");

const app = express();
const port = process.env.PORT || 3001;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: dbSchema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`Express server running on port: ${port}`);
});
