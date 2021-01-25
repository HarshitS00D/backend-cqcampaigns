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
    if (Payload) Payload = JSON.parse(Payload);
    switch (event) {
      case "sent":
        console.log({ event, Payload });
        res.send("sent");
        break;
      case "bounce":
        console.log({ event, Payload });
        res.send("bounce");
        break;
      default:
        console.log(req.body);
        res.send(req.body);
    }
  },
};
