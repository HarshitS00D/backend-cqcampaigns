const { Settings } = require("../database/models");
module.exports = {
  changeSettings: async (payload, userID) => {
    try {
      const res = await Settings.updateOne({ userID }, payload);
      return res;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
  getSettings: async (userID) => {
    try {
      const response = await Settings.findOne({ userID });
      return response;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
};
