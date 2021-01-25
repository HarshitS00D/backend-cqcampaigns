const { Subscriber, List } = require("../database/models");
const _ = require("lodash");
const { ObjectId } = require("mongoose").Types;

module.exports = {
  deleteSubscribers: async (subIDs, listID) => {
    try {
      const res = {};
      res.subs = await Subscriber.deleteMany({
        $or: subIDs.map((_id) => ({ _id })),
      });
      res.list = await List.updateMany(
        { _id: listID },
        {
          $pull: { subscribers: { $in: subIDs } },
          $inc: { total: -subIDs.length },
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getSubscribers: async (listID, { filters = {}, select, pagination = {} }) => {
    try {
      const total = await Subscriber.countDocuments({ ...filters, listID });
      const data = await Subscriber.find(
        { ...filters, listID },
        {
          listID: 0,
          __v: 0,
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
      return { data, total };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  editSubscriber: async (match, payload) => {
    try {
      if (!match) throw new Error("Nothing to match");
      const res = await Subscriber.updateOne(match, payload);

      return res;
    } catch (error) {
      console.error(error);
      return { error };
    }
  },
};
