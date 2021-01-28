const { Template } = require("../database/models");
const _ = require("lodash");

module.exports = {
  createTemplate: async (data, { _id: userID }) => {
    try {
      if (!userID) throw new Error("No user id");
      const template = new Template({ userID, ...data });

      await template.save();
      return template;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getTemplates: async (
    { filters, select = {}, pagination = {} },
    { _id: userID }
  ) => {
    try {
      if (!userID) throw new Error("No user id");
      const total = await Template.countDocuments({ userID, ...filters });
      const templates = await Template.find(
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
  deleteTemplates: async (templateIDs, user) => {
    try {
      if (!user) throw new Error("No user id");

      const res = await Template.deleteMany({
        _id: { $in: templateIDs },
        userID: user._id,
      });

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  editTemplate: async (_id, payload, { _id: userID }) => {
    try {
      if (!userID) throw new Error("No user id");

      const res = await Template.updateOne({ _id, userID }, payload);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getTemplateById: async (_id, { _id: userID }) => {
    try {
      if (!userID) throw new Error("No user id");
      const res = await Template.findById(_id);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
