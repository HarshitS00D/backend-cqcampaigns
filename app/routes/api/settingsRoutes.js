const router = require("express").Router();

const controllers = require("../../controllers");

router.post("/", controllers.settings.changeSettings);
router.get("/", controllers.settings.getSettings);

module.exports = router;
