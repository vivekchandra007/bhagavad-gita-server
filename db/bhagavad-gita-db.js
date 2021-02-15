const MongoClient = require("mongodb").MongoClient;

const URI = `mongodb+srv://bhakt:${process.env.VIVEK_MONGODB_KRISHNA_BHAGAVAD_GITA_BHAKT_PASSWORD}@bhagavad-gita.kcosh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const NAME = "bhagavad-gita";
const COLLECTIONS = {
  SHLOKAS: "shlokas",
  SHLOKAS_CORE: "shlokas-core",
  CHAPTERS: "chapters",
  SPEAKERS: "speakers",
  LANGUAGES: "languages",
  TAGS: "tags",
  CLIENTS: "clients",
};

async function findInCollectionByQuery(collectionName, query, nonUnique) {
  const client = await MongoClient.connect(URI, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) {
    console.log(
      "Bhagavad Gita DB connection error. Please retry, else contact Admin."
    );
    return;
  }

  try {
    const db = client.db(NAME);
    let collection = db.collection(collectionName);
    let res = {};
    if (query) {
      if (!nonUnique) {
        res = await collection.findOne(query);
      } else {
        res = await collection.find(query).toArray;
      }
    } else {
      res = await collection.find().toArray();
    }
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

module.exports = {
  COLLECTIONS,
  findInCollectionByQuery,
};
