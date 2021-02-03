const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const dbSchema = require("./schema/db-schema");

const app = express();
const port = process.env.PORT || 3000;

// No access without a valid access token (one received after calling calling /oauth2/v1/ route)
//app.use(require("./middlewares/auth"));

app.get("/auth/oauth/v1/token/", (req, res) => {
  res.status(200).json({
    token:
      "HareKrishnaHareKrishnaKrishnaKrishnaHareHareHareRamHareRamRamRamHareHare",
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
  res.status(200).json({ message: "This API works." });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hare Krishna !!!" });
});

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
