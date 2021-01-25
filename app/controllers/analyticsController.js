const services = require("../../services");

module.exports = {
  getAnalytics: async (req, res) => {
    const userID = req.user._id;
    const { groupBy } = req.query;
    if (!userID) return res.status(406).send("No UserID");
    const response = await services.analytics.getAnalytics(userID, groupBy);
    if (response.error) return res.status(500).send(response);
    res.send(response);
  },
  eventHandler: async (req, res) => {
    let { event, Payload } = req.body;
    Payload = JSON.parse(Payload);
    switch (event) {
      case "sent":
        res.send("sent");
        break;
      case "bounce":
        res.send("bounce");
        break;
      default:
        res.send(req.body);
    }
  },
};
