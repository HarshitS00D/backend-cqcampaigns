const { Campaign, Analytics } = require("../database/models");
const _ = require("lodash");

module.exports = {
  updateCampaignStats: async (campaignID, payload) => {
    try {
      const analytics = new Analytics({ campaignID, ...payload });
      await analytics.save();
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
            sent: { $sum: "$sent" },
            delivered: { $sum: "$delivered" },
            bounced: { $sum: "$bounced" },
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
