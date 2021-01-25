const router = require("express").Router();
const controllers = require("../controllers");

router.post("/login", controllers.auth.login);

module.exports = router;
