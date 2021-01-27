const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const path = require("path");
require("../database");

app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(routes);

app.use(express.static(`${__dirname}/../public/build`));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "build", "index.html"));
});

module.exports = function constructor(settings) {
  const { port } = settings;

  this.app = app;

  this.listen = function listen() {
    app.listen(port, () => console.log(`Server listening at ${port}`));
  };
};
