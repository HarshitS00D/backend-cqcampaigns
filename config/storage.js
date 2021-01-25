const multer = require("multer");

const config = require("./");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.storagePath);
  },
  filename: (req, file, cb) => {
    cb(null, req.user._id + "-" + file.originalname);
  },
});

module.exports = storage;
