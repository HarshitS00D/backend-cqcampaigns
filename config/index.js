require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  //mongoURL: process.env.MONGO_URL,
  mongoURL: process.env.MONGO_ATLAS_URL,
  //refreshSecret: process.env.REFRESH_SECRET ,
  sessionSecret: process.env.SESSION_SECRET,
  storagePath: process.env.FILE_STORAGE || "public/storage",
};
