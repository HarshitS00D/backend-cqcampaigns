const App = require("./app");

const app = new App({ port: process.env.PORT || 3001 });

app.listen();
