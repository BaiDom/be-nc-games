const db = require("../db/connection.js");
const comments = require("../db/data/test-data/comments.js");

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
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return res.rows;
    });
};
