const router = require("express").Router();
const controllers = require("../../controllers");

router.delete("/", controllers.subscriber.deleteSubscribers);
router.get("/unsubscribe/:_id", controllers.subscriber.unsubscribe);

module.exports = router;
