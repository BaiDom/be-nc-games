const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewVotes,
  getUsers,
  getReviewsWithCommentCount,
} = require("../controllers/nc-games");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.patch("/api/reviews/:review_id", patchReviewVotes);
app.get("/api/users", getUsers);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
