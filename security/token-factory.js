const jwt = require("jsonwebtoken");

const SECRET = process.env.VIVEK_BHAGAVAD_GITA_SERVER_SECRET;

const generateToken = (client_id) => {
  const expiresIn = 24 * 60 * 60;
  // access tokens like "HareKrishnaHareKrishnaKrishnaKrishnaHareHareHareRamHareRamRamRamHareHare"
  const accessToken = jwt.sign({ id: client_id }, SECRET, {
    expiresIn: expiresIn,
  });
  return accessToken;
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
