const router = require("express").Router();
const controllers = require("../../controllers");

router.post("/sendmail", controllers.email.sendEmails);

router.post("/", controllers.campaign.createCampaign);
router.delete("/", controllers.campaign.deleteCampaigns);
router.get("/", controllers.campaign.getCampaigns);

router.patch("/:campaignID", controllers.campaign.editCampaign);

module.exports = router;
