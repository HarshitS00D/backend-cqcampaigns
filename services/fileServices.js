const csv = require("csvtojson");
const _ = require("lodash");
const fs = require("fs");
const config = require("../config");

module.exports = {
  readCSV: async (fileName) => {
    try {
      const filePath = config.storagePath + fileName;
      const jsonArray = await csv()
        .fromFile(filePath)
        .on("header", (headers) => {
          if (!headers.map((el) => el.toLowerCase()).includes("email"))
            throw new Error("Email header not present");
        });
      fs.unlinkSync(filePath);
      return jsonArray.map((obj) =>
        _.mapKeys(obj, (val, key) => key.toLowerCase())
      );
    } catch (e) {
      return e.message;
    }
  },
  createCSVfromJson: (jsonArray) => {
    const escapeCSV = (s) => String(s).replace(/"/g, '""');
    try {
      if (!jsonArray.length) throw new Error("No row selected");
      const csvHeader = _.keys(jsonArray[0]);
      const csvBody = jsonArray.map((obj) =>
        _.values(obj)
          .map((text) => (text ? `"${escapeCSV(text)}"` : undefined))
          .join(",")
      );
      return { csv: `${csvHeader.join(",")}\n${csvBody.join("\n")}` };
    } catch (e) {
      return e;
    }
  },
};
