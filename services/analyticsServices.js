const { Campaign, Analytics } = require("../database/models");
const _ = require("lodash");

module.exports = {
  createNewAnalytics: async (campaignID, payload = {}) => {
    try {
      const analytics = new Analytics({ campaignID, ...payload });
      await analytics.save();
      return analytics;
    } catch (error) {
      console.log(error);
    }
  },
  updateStats: async (_id, payload) => {
    try {
      const analytics = await Analytics.updateOne({ _id }, payload);

      return analytics;
    } catch (error) {
      console.log(error);
    }
  },
  getAnalytics: async (userID, groupBy) => {
    try {
      let campaignIDs = await Campaign.find({ userID }, { _id: 1 });
      campaignIDs = campaignIDs.map(({ _doc }) => _doc._id);
      const analytics = await Analytics.aggregate([
        {
          $match: {
            campaignID: { $in: campaignIDs },
          },
        },
        {
          $group: {
            _id: {
              monthNo: { [`$${groupBy ? groupBy : "month"}`]: "$createdAt" },
              //  year: { $year: "$createdAt" },
            },
            sent: { $sum: { $size: "$sent" } },
            delivered: { $sum: { $size: "$delivered" } },
            bounced: { $sum: { $size: "$bounced" } },
            open: { $sum: { $size: "$open" } },
          },
        },
      ]).sort({ "_id.year": 1, "_id.monthNo": 1 });
      return analytics;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
};
