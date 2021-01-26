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

    if (!event || !event.length) return res.send("event err");
    if (!Payload || !Payload.analyticsID) return res.send("payload err");
    console.log({ event, Payload });
    if (event === "sent") event = "delivered";
    switch (event) {
      case "unsub":
        break;
      default:
        await services.analytics.updateStats(Payload.analyticsID, {
          $inc: { [event]: 1, sent: 1 },
        });
    }
    res.send(event);
  },
};
