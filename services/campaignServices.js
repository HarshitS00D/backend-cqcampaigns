const { Campaign, Analytics } = require("../database/models");
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
      const templates = await Campaign.find(
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
        }
      )

        .skip(pagination.skip || 0)
        .limit(pagination.limit || total);

      return { data: templates, total };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
