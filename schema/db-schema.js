const graphql = require("graphql");
const MongoClient = require("mongodb").MongoClient;

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const dbUri = `mongodb+srv://bhakt:${process.env.VIVEK_MONGODB_KRISHNA_BHAGAVAD_GITA_BHAKT_PASSWORD}@bhagavad-gita.kcosh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
//const client = new MongoClient(dbUri, { useNewUrlParser: true });

const ShlokaTranslatedType = new GraphQLObjectType({
  name: "ShlokaTranslated",
  fields: () => ({
    _id: { type: GraphQLString },
    language_id: { type: GraphQLString },
    shloka_id: { type: GraphQLString },
    text: { type: GraphQLString },
    word_by_word_translation: { type: GraphQLString },
    translation: { type: GraphQLString },
    purport: { type: GraphQLString },
  }),
});

const RootQuery = new graphql.GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    shloka: {
      type: ShlokaTranslatedType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return findShlokaByID(args._id);
      },
    },
  }),
});

async function findShlokaByID(_id) {
  const client = await MongoClient.connect(dbUri, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) {
    console.log("DB connection error.");
    return;
  }

  try {
    const db = client.db("bhagavad-gita");
    let collection = db.collection("shlokas-translated");
    let query = { _id };
    let res = await collection.findOne(query);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

module.exports = new GraphQLSchema({
  query: RootQuery,
});
