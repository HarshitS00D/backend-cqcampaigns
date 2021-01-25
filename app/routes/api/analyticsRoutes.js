const router = require("express").Router();
const controllers = require("../../controllers");

router.post("/sent", controllers.analytics.eventHandler);
router.post("/bounce", controllers.analytics.eventHandler);
router.post("/unsub", controllers.analytics.eventHandler);

router.get("/", controllers.analytics.getAnalytics);

module.exports = router;
