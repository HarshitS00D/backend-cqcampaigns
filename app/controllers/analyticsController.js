const services = require("../../services");

module.exports = {
  getAnalytics: async (req, res) => {
    const userID = req.user._id;
    const { groupBy, year } = req.query;
    if (!userID) return res.status(406).send("No UserID");
    const response = await services.analytics.getAnalytics(
      userID,
      groupBy,
      year
    );
    if (response.error) return res.status(500).send(response);
    res.send(response);
  },
  eventHandler: async (req, res) => {
    let { event, email, Payload } = req.body;
    if (Payload) Payload = JSON.parse(Payload);

    console.log(req.body);
    if (!event || !event.length) return res.send("event err");
    if (!Payload || !Payload.analyticsID) return res.send("payload err");

    if (event === "unsub") return res.send("unsub");
    event = getFieldFromEvent(event);

    const payload = {
      $addToSet: { [event]: email },
    };

    switch (event) {
      case "delivered":
      case "bounced":
        payload.$addToSet.sent = email;
        break;
    }
    await services.analytics.updateStats(Payload.analyticsID, payload);
    res.send(event);
  },
  onImgLoad: async (req, res) => {
    console.log(req.ip);
    res.send("");
  },
};

function getFieldFromEvent(e) {
  if (e === "sent") return "delivered";
  if (e === "bounce") return "bounced";
  return e;
}
