const _ = require("lodash");
const url = require("url");

const { compareCrypt } = require("../../utils");
const services = require("../../services");
const { User } = require("../../database/models");

const checkAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const href = req.protocol + "://" + req.get("host") + req.originalUrl;
  const urlPaths = url.parse(href).pathname.split("/");
  if (
    urlPaths.includes("unsubscribe") ||
    (urlPaths.includes("analytics") &&
      (urlPaths.includes("sent") ||
        urlPaths.includes("bounce") ||
        urlPaths.includes("img")))
  ) {
    return next();
  }

  services.auth.verifyToken(authHeader, (err, user) => {
    if (err) {
      console.log(err);
      return res.send({ error: "Invalid Token" });
    }
    req.user = user;
    if (urlPaths.includes("user") && user.role > 1)
      return res.status(401).send({ error: "Not Authorized" });
    next();
  });
};

const login = (req, res) => {
  const { email, password, token } = req.body;

  if (token) {
    services.auth.verifyToken(token, (err, user) => {
      if (!err) res.send({ token, user });
      else res.status(400).send("Session Expired");
    });
    return;
  }

  User.findOne({ email })
    .then(async (user) => {
      if (!user)
        return res
          .status(401)
          .json({ field: "email", error: "Email not registered" });

      if (!(await compareCrypt(password, user.password)))
        return res
          .status(401)
          .json({ field: "password", error: "Wrong password" });

      user = _.omit(user._doc, "password");
      const { token, expiresAt } = services.auth.createJwt(user);

      res.send({ token, expiresAt, user });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Internal Server Error");
    });
};

module.exports = {
  checkAuth,
  login,
};
