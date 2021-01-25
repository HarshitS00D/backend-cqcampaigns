const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      defaultValue: 2,
    },
  },
  {
    timestamps: true,
  }
);

const List = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" }],
  },
  {
    timestamps: true,
  }
);

const Subscriber = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    listID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    subscribed: { type: Boolean, default: true },
    feedback: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Template = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fromName: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    analytics: [Number],
    bodyType: { type: Number, default: 0 },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    templateID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Analytics = new mongoose.Schema(
  {
    campaignID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    sent: { type: Number, defaultValue: 0 },
    delivered: { type: Number, defaultValue: 0 },
    bounced: { type: Number, defaultValue: 0 },
  },
  {
    timestamps: true,
  }
);

const Settings = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  MailjetUsername: String,
  MailjetPassword: String,
});

module.exports = {
  User: mongoose.model("User", User),
  List: mongoose.model("List", List),
  Subscriber: mongoose.model("Subscriber", Subscriber),
  Template: mongoose.model("Template", Template),
  Campaign: mongoose.model("Campaign", Campaign),
  Analytics: mongoose.model("Analytics", Analytics),
  Settings: mongoose.model("Settings", Settings),
};
