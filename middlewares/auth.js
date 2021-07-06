const jwt = require("jsonwebtoken");

const constants = require("../common/constants");
const messages = require("../common/messages");

const tokenFactory = require("../security/token-factory");

const { join } = require("path");

module.exports = (req, res, next) => {
  if (req._parsedUrl.pathname === "/auth/oauth/v1/token") {
    // requesting token (through POST and https access only)
    if (
      req.headers["host"] === `localhost:${constants.LOCALHOST_PORT}` ||
      (req.method === "POST" && req.headers["x-forwarded-proto"] == "https")
    ) {
      next();
    } else {
      res.status(401).json({
        message: messages.TOKEN_GEN_ACCESS_ERRROR,
      });
    }
  } else {
    // must have token, so verify and only then proceed, else not authorized
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (tokenFactory.verifyToken(token)) {
        req.token = token;
        next();
      } else {
        res.status(401).setHeader("Location", "/notAuthorized.html").end();
      }
    } catch (error) {
      res.status(401).setHeader("Location", "/notAuthorized.html").end();
    }
  }
};
