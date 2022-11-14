const express = require("express");
const { getCategories } = require("../controllers/nc-games");

const app = express();
// app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
