const graphql = require("graphql");
const bhagavadGitaDB = require("../db/bhagavad-gita-db");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
} = graphql;

const ShlokaType = new GraphQLObjectType({
  name: "Shloka",
  fields: () => ({
    _id: { type: GraphQLString },
    language: {
      type: LanguageType,
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.LANGUAGES,
          {
            _id: parent.language_id,
          }
        );
      },
    },
    shloka_core: {
      type: ShlokaCoreType,
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SHLOKAS_CORE,
          {
            _id: parent.shloka_core_id,
          }
        );
      },
    },
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
    chapter: {
      type: ChapterType,
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.CHAPTERS,
          {
            _id: parseInt(parent.chapter_id),
          }
        );
      },
    },
    shloka: { type: GraphQLString },
    image: { type: GraphQLString },
    speaker: {
      type: SpeakerType,
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SPEAKERS,
          {
            _id: parseInt(parent.speaker_id),
          }
        );
      },
    },
    original_text: { type: GraphQLString },
    tags: { 
      type: GraphQLList(TagType),
      resolve(parent, args) {
        let result = [];
        parent.tags.forEach(tag => {
          result.push(
            bhagavadGitaDB.findInCollectionByQuery(
              bhagavadGitaDB.COLLECTIONS.TAGS,
              {
                _id: tag,
              }
            )
          );
        });
        return result;
      } 
    },
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
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SHLOKAS,
          {
            _id: args._id,
          }
        );
      },
    },
    shlokas: {
      type: GraphQLList(ShlokaType),
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SHLOKAS
        );
      },
    },
    shloka_core: {
      type: ShlokaCoreType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SHLOKAS_CORE,
          {
            _id: args._id,
          }
        );
      },
    },
    shlokas_core: {
      type: GraphQLList(ShlokaCoreType),
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SHLOKAS_CORE
        );
      },
    },
    chapter: {
      type: ChapterType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.CHAPTERS,
          {
            _id: parseInt(args._id),
          }
        );
      },
    },
    chapters: {
      type: GraphQLList(ChapterType),
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.CHAPTERS
        );
      },
    },
    speaker: {
      type: SpeakerType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SPEAKERS,
          {
            _id: parseInt(args._id),
          }
        );
      },
    },
    speakers: {
      type: GraphQLList(SpeakerType),
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.SPEAKERS
        );
      },
    },
    language: {
      type: LanguageType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.LANGUAGES,
          {
            _id: args._id,
          }
        );
      },
    },
    languages: {
      type: GraphQLList(LanguageType),
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.LANGUAGES
        );
      },
    },
    tag: {
      type: TagType,
      args: { _id: { type: GraphQLString } },
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.TAGS,
          {
            _id: args._id,
          }
        );
      },
    },
    tags: {
      type: GraphQLList(TagType),
      resolve(parent, args) {
        return bhagavadGitaDB.findInCollectionByQuery(
          bhagavadGitaDB.COLLECTIONS.TAGS
        );
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
