const { User, List, Subscriber } = require("../database/models");
const { ObjectId } = require("mongoose").Types;
const _ = require("lodash");

module.exports = {
  createListFromJson: async (listName, data, user) => {
    try {
      if (!user) throw new Error("No user id");
      const list = new List({
        name: listName,
        user: new User(user),
        total: data.length,
      });
      for (subscriber of data) {
        subscriber = new Subscriber({
          ...subscriber,
          listID: ObjectId(list._id),
        });
        await subscriber.save();
        list.subscribers.push(subscriber);
      }
      await list.save();
      return list;
    } catch (error) {
      return error;
    }
  },
  updateList: async (_id, update, user) => {
    try {
      if (!user) throw new Error("No user id");
      if (update.$push && update.$push.subscribers) {
        let res = {};
        update.$push.subscribers = await Promise.all(
          update.$push.subscribers.map(async (subscriber) => {
            subscriber = await new Subscriber(subscriber).save();
            res = await List.updateOne(
              { _id, user: user._id },
              { $inc: { total: 1 }, $push: { subscribers: subscriber } }
            );
            return subscriber;
          })
        );
        return res;
      } else {
        const res = await List.updateOne({ _id, user: user._id }, update);
        return res;
      }
    } catch (error) {
      return error;
    }
  },
  deleteLists: async (listIDs, user) => {
    try {
      if (!user) throw new Error("No user id");
      const list = await List.deleteMany({
        _id: { $in: listIDs },
        user: user._id,
      });
      let subs = {};
      for (listID of listIDs)
        subs[listID] = await Subscriber.deleteMany({
          listID,
        });

      return { list, subs };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getUserLists: async (user, { filters, select, pagination = {} }) => {
    try {
      if (!user) throw new Error("No user id");
      const total = await List.countDocuments({ user, ...filters });
      const lists = await List.find(
        { user, ...filters },
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

      return { data: lists, total };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getListDetailsById: async (_id, isSubscriberDetailsRequired) => {
    let list = [];
    if (isSubscriberDetailsRequired)
      list = await List.findById(_id).populate("subscribers");
    else list = await List.findById(_id);
    return list;
  },
};
