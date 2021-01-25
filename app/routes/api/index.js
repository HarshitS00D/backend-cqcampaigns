const router = require("express").Router();
const controllers = require("../../controllers");
const fs = require("fs");

fs.readdirSync("./app/routes/api").forEach((file) => {
  file !== "index.js" &&
    router.use(
      `/${file.replace(`Routes.js`, ``)}`,
      controllers.auth.checkAuth,
      require(`./${file}`)
    );
});

module.exports = router;
