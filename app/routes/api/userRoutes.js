const router = require("express").Router();

const controllers = require("../../controllers");

router.post("/", controllers.user.createUser);
router.delete("/", controllers.user.deleteUsers);
router.get("/", controllers.user.getUsers);
router.patch("/:userID", controllers.user.editUser);

module.exports = router;
