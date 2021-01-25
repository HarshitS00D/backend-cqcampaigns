const router = require("express").Router();
const fs = require("fs");

fs.readdirSync("./app/routes").forEach((file) => {
  file !== "index.js" &&
    router.use(`/${file.replace(`Routes.js`, ``)}`, require(`./${file}`));
});

module.exports = router;
