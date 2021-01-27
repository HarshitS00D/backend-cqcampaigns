const { Campaign } = require("../database/models");
const { getCampaignStats } = require("./analyticsServices");
const _ = require("lodash");

module.exports = {
  createCampaign: async (data, { _id: userID }) => {
    try {
      if (!userID) throw new Error("No user id");
      const campaign = new Campaign({ userID, ...data });
      // await new Analytics({ campaignID: campaign._id }).save();
      await campaign.save();
      return campaign;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  deleteCampaigns: async (campaignIDs, user) => {
    try {
      if (!user) throw new Error("No user id");

      const res = await Campaign.deleteMany({
        _id: { $in: campaignIDs },
        userID: user._id,
      });

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getCampaigns: async (
    { filters, select = {}, pagination = {} },
    { _id: userID }
  ) => {
    try {
      if (!userID) throw new Error("No user id");

      const total = await Campaign.countDocuments({ userID, ...filters });
      let campaigns = await Campaign.find(
        { userID, ...filters },
        {
          ...(Array.isArray(select)
            ? _.transform(
                select,
                (result, s) => {
                  result[s] = 1;
                },
                {}
              )
            : select),
          __v: 0,
        }
      )
        .skip(pagination.skip || 0)
        .limit(pagination.limit || total);

      campaigns = await Promise.all(
        campaigns.map(async (el) => ({
          ...el._doc,
          analytics: await getCampaignStats(el._id),
        }))
      );

      return { data: campaigns, total };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
