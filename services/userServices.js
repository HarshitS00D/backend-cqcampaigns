const { User, Settings } = require("../database/models");
const { hashCrypt } = require("../utils");

module.exports = {
  createUser: async (payload, user) => {
    try {
      if (user && user.role > 1)
        throw new Error("Not authorized for the action");
      //payload.password = await hashCrypt(payload.password);
      let res = await User.find({ email: payload.email });

      if (res.length)
        return { error: { email: "Account already exists with this email" } };

      res = new User(payload);
      await res.save();
      settings = new Settings({ userID: res._id });
      await settings.save();

      return { success: "User Created" };
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
  deleteUsers: async (emails, user) => {
    try {
      if (user && user.role > 1)
        throw new Error("Not authorized for the action");
      const users = await User.find({ email: { $in: emails } }, { _id: 1 });
      let res = await User.deleteMany({ email: { $in: emails } });

      await Settings.deleteMany({ userID: { $in: users } });
      return res;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
  getUsers: async ({ filters, pagination = {} }) => {
    try {
      const total = await User.countDocuments({ ...filters });
      const users = await User.find(
        { ...filters },
        {
          __v: 0,
          password: 0,
        }
      )
        .skip(pagination.skip || 0)
        .limit(pagination.limit || total);

      return { data: users, total };
    } catch (error) {
      console.log({ error });
      return { error };
    }
  },
  editUser: async (_id, payload, user) => {
    try {
      if (!user._id) throw new Error("No user id");

      const res = await User.updateOne({ _id }, payload);

      return res;
    } catch (error) {
      console.log({ error });
      return error;
    }
  },
};
