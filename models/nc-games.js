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
