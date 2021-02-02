const jwt = require("jsonwebtoken");

const SECRET = process.env.VIVEK_BHAGAVAD_GITA_SERVER_SECRET;

module.exports = (req, res, next) => {
  if (req._parsedUrl.pathname === "/auth/oauth/v1/token") {
    // requesting token
    //if (req.method === "POST" && req.secure) {
    if (req.protocol === "https") {
      next();
    } else {
      res.status(401).json({
        message:
          "Only through POST request over HTTPS can an Access Token be generated." +
          req.protocol,
      });
    }
  } else {
    // must have token, so verify and only then proceed, else not authorized
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, SECRET);
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not Authorized to access this." });
    }
  }
};
