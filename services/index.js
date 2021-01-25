const fs = require("fs");

fs.readdirSync("./services").forEach((file) => {
  if (file === "index.js") return;

  module.exports[`${file.replace(`Services.js`, ``)}`] = require(`./${file}`);
});
