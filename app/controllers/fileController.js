const config = require("../../config");
const storage = require("../../config/storage");

const multer = require("multer");

const uploader = multer({ storage });

module.exports = { uploader };
