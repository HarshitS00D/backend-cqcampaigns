const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");
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

const buildPath = `${__dirname}\\..\\public\\build`;
app.use(express.static(buildPath));

module.exports = function constructor(settings) {
  const { port } = settings;

  this.app = app;

  this.listen = function listen() {
    app.listen(port, () => console.log(`Server listening at ${port}`));
  };
};
