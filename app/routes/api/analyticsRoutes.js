const router = require("express").Router();
const controllers = require("../../controllers");

router.post("/sent", (req, res) => {});
router.post("/bounce", (req, res) => {});

router.get("/", controllers.analytics.getAnalytics);

module.exports = router;
