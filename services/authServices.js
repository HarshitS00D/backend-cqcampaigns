const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = {
  createJwt: (payload) => {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    return {
      token: jwt.sign(payload, config.sessionSecret, { expiresIn: "1 day" }),
      expiresAt,
    };
  },
  verifyToken: (token, callback) =>
    jwt.verify(token, config.sessionSecret, callback),
};
