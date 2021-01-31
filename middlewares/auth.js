const jwt = require("jsonwebtoken");

const SECRET = process.env.VIVEK_BHAGAVAD_GITA_SERVER_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed!" });
  }
};
