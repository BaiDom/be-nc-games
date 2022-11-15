const db = require("../db/connection.js");
const comments = require("../db/data/test-data/comments.js");
const { checkReviewExists } = require("../db/seeds/utils.js");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
       SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count
       FROM reviews
       LEFT JOIN comments ON reviews.review_id = comments.review_id
       GROUP BY reviews.review_id
       ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchReviewsById = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM reviews WHERE review_id = $1;
    `,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid review id" });
      }
      return res.rows;
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return checkReviewExists(review_id)
    .then(() => {
      return db.query(
        `
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;
    `,
        [review_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};
