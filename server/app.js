const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/development.env",
});

const port = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
