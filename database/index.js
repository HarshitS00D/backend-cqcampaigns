const mongoose = require("mongoose");
const config = require("../config");

module.export = mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error("An error has occured", err));
