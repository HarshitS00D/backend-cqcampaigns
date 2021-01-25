const router = require("express").Router();

const controllers = require("../../controllers");

router.post("/", controllers.template.createTemplate);
router.get("/", controllers.template.getTemplates);
router.patch("/:templateID", controllers.template.editTemplate);
router.delete("/", controllers.template.deleteTemplates);

module.exports = router;
