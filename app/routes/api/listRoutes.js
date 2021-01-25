const router = require("express").Router();

const controllers = require("../../controllers");
const { disableRoute } = require("../../../utils");

router.get("/", controllers.list.getUserLists);
router.delete("/", controllers.list.deleteLists);
router.patch("/", controllers.list.updateList);
router.post("/", controllers.list.createList);

router.get("/:listID", controllers.subscriber.getListSubscribers);

router.get("/:listID/download", controllers.subscriber.downloadSubscribersList);

router.post(
  "/upload",
  controllers.file.uploader.single("file"),
  controllers.list.readList
);

module.exports = router;
