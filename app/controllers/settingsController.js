const services = require("../../services");
const _ = require("lodash");

module.exports = {
  changeSettings: async (req, res) => {
    const payload = req.body;

    const response = await services.settings.changeSettings(
      _.omit(payload, "userID"),
      req.user._id
    );
    if (response && response.error) return res.status(500).send(response.error);
    res.send(response);
  },
  getSettings: async (req, res) => {
    const response = await services.settings.getSettings(req.user._id);
    if (response && response.error) return res.status(500).send(response.error);
    res.send(response);
  },
};
