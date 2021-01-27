const graphql = require("graphql");
const MongoClient = require("mongodb").MongoClient;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
} = graphql;

const DB = {
  URI: `mongodb+srv://bhakt:${process.env.VIVEK_MONGODB_KRISHNA_BHAGAVAD_GITA_BHAKT_PASSWORD}@bhagavad-gita.kcosh.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  GITA: {
    NAME: "bhagavad-gita",
    COLLECTIONS: {
      SHLOKAS: "shlokas",
      SHLOKAS_CORE: "shlokas-core",
      CHAPTERS: "chapters",
      SPEAKERS: "speakers",
      LANGUAGES: "languages",
      TAGS: "tags",
    },
  },
};

const ShlokaType = new GraphQLObjectType({
  name: "Shloka",
  fields: () => ({
    _id: { type: GraphQLString },
    language_id: { type: GraphQLString },
    shloka_core_id: { type: GraphQLString },
    text: { type: GraphQLString },
    word_by_word_translation: { type: GraphQLString },
    translation: { type: GraphQLString },
    purport: { type: GraphQLString },
  }),
});

const ShlokaCoreType = new GraphQLObjectType({
  name: "Shloka_Core",
  fields: () => ({
    _id: { type: GraphQLString },
    chapter_id: { type: GraphQLString },
    shloka: { type: GraphQLString },
    image: { type: GraphQLString },
    speaker_id: { type: GraphQLString },
    original_text: { type: GraphQLString },
    tags: { type: GraphQLList(GraphQLString) },
  }),
});

const ChapterType = new GraphQLObjectType({
  name: "Chapter",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    title_en: { type: GraphQLString },
    title_hi: { type: GraphQLString },
  }),
});

const SpeakerType = new GraphQLObjectType({
  name: "Speaker",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    name_en: { type: GraphQLString },
    name_hi: { type: GraphQLString },
  }),
});

const LanguageType = new GraphQLObjectType({
  name: "Language",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    _id: { type: GraphQLString },
    text: { type: GraphQLString },
    text_en: { type: GraphQLString },
    text_hi: { type: GraphQLString },
  }),
});

const RootQuery = new graphql.GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    shloka: {
      type: ShlokaType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return findOneInCollectionByQuery(DB.GITA.COLLECTIONS.SHLOKAS, {
          _id: args._id,
        });
      },
    },
    shloka_core: {
      type: ShlokaCoreType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return findOneInCollectionByQuery(DB.GITA.COLLECTIONS.SHLOKAS_CORE, {
          _id: args._id,
        });
      },
    },
    chapter: {
      type: ChapterType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return findOneInCollectionByQuery(DB.GITA.COLLECTIONS.CHAPTERS, {
          _id: parseInt(args._id),
        });
      },
    },
    speaker: {
      type: SpeakerType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return findOneInCollectionByQuery(DB.GITA.COLLECTIONS.SPEAKERS, {
          _id: parseInt(args._id),
        });
      },
    },
    language: {
      type: LanguageType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return findOneInCollectionByQuery(DB.GITA.COLLECTIONS.LANGUAGES, {
          _id: args._id,
        });
      },
    },
    tag: {
      type: TagType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return findOneInCollectionByQuery(DB.GITA.COLLECTIONS.TAGS, {
          _id: args._id,
        });
      },
    },
  }),
});

async function findOneInCollectionByQuery(collectionName, query) {
  const client = await MongoClient.connect(DB.URI, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) {
    console.log("DB connection error.");
    return;
  }

  try {
    const db = client.db(DB.GITA.NAME);
    let collection = db.collection(collectionName);
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
