const router = require("express").Router();
const controllers = require("../../controllers");

router.get("/", controllers.analytics.getAnalytics);

router.get("/img", controllers.analytics.onImgLoad);

router.post("/sent", controllers.analytics.eventHandler);
router.post("/bounce", controllers.analytics.eventHandler);
router.post("/unsub", controllers.analytics.eventHandler);

module.exports = router;
