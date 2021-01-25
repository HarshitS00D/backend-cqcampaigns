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
};
