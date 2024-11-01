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
  getAnalytics: async (userID, groupBy, year) => {
    try {
      let campaignIDs = await Campaign.find({ userID }, { _id: 1 });
      campaignIDs = campaignIDs.map(({ _doc }) => _doc._id);

      groupBy = (groupBy || "month").trim().toLowerCase();

      const currentYear = new Date().getFullYear();
      const query = [
        {
          $match: {
            campaignID: {
              $in: campaignIDs,
            },
            ...(groupBy === "month"
              ? {
                  createdAt: {
                    $gt: new Date(`${year || currentYear}-01-01 00:00:00`),
                    $lt: new Date(
                      `${parseInt(year || currentYear) + 1}-1-1 00:00:00`
                    ),
                  },
                }
              : {}),
          },
        },
      ];

      if (groupBy && groupBy.length)
        query.push({
          $group: {
            _id: {
              monthNo: { [`$${groupBy}`]: "$createdAt" },
              //  year: { $year: "$createdAt" },
            },
            sent: { $sum: { $size: "$sent" } },
            delivered: { $sum: { $size: "$delivered" } },
            bounced: { $sum: { $size: "$bounced" } },
            open: { $sum: { $size: "$open" } },
          },
        });
      //console.log(JSON.stringify(query, null, 2));
      const analytics = await Analytics.aggregate(query).sort({
        "_id.year": 1,
        "_id.monthNo": 1,
      });
      return analytics;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
  getCampaignStats: async (campaignID) => {
    try {
      const query = [
        {
          $match: { campaignID },
        },
        {
          $group: {
            _id: { campaignID: "$campaignID" },
            sent: { $sum: { $size: "$sent" } },
            delivered: { $sum: { $size: "$delivered" } },
            bounced: { $sum: { $size: "$bounced" } },
            open: { $sum: { $size: "$open" } },
          },
        },
      ];

      const analytics = await Analytics.aggregate(query);
      if (!analytics.length)
        return {
          sent: 0,
          delivered: 0,
          bounced: 0,
          open: 0,
        };
      return _.pick(analytics[0], ["sent", "delivered", "bounced", "open"]);
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
};
