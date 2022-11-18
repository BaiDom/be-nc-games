const db = require("../db/connection.js");
const comments = require("../db/data/test-data/comments.js");
const {
  checkReviewExists,
  checkCommentExists,
} = require("../db/seeds/utils.js");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const queryVals = [];

  let queryStr = `
  SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`;

  if (category) {
    const validCategory = ["euro game", "dexterity", "social deduction"];
    if (category && !validCategory.includes(category)) {
      return Promise.reject({ status: 400, msg: "Invalid category" });
    }
    queryStr += ` WHERE category = $1`;
    queryVals.push(category);
  }

  if (sort_by) {
    const validColumns = [
      "review_id",
      "title",
      "category",
      "designer",
      "owner",
      "review_body",
      "review_img_url",
      "created_at",
      "votes",
      "comment_count",
    ];
    if (!validColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid sort query" });
    } else {
      queryStr += ` GROUP BY reviews.review_id
     ORDER BY ${sort_by}`;
    }
  }

  if (order) {
    validOrders = ["ASC", "DESC"];
    if (!validOrders.includes(order)) {
      return Promise.reject({ status: 400, msg: "Invalid sort query order" });
    } else {
      queryStr += ` ${order}`;
    }
  }

  queryStr += ";";

  return db.query(queryStr, queryVals).then((result) => {
    return result.rows;
  });
};

exports.fetchReviewsById = (review_id) => {
  return checkReviewExists(review_id)
    .then(() => {
      return db.query(
        `
        SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id
        ORDER BY created_at DESC;`,
        [review_id]
      );
    })
    .then((res) => {
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

exports.insertCommentByReviewId = (comment, review_id) => {
  const { username, body } = comment;
  const queryStr =
    "INSERT INTO comments (author, body, review_id) VALUES ($1,$2, $3) RETURNING *;";
  const queryVals = [username, body, review_id];
  return checkReviewExists(review_id)
    .then(() => {
      return db.query(queryStr, queryVals);
    })
    .then((res) => {
      return res.rows[0];
    });
};

exports.updateReviewVotes = (review_id, patch) => {
  const { inc_votes } = patch;
  const queryStr = `
  UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;
  const queryVals = [inc_votes, review_id];
  return checkReviewExists(review_id)
    .then(() => {
      return db.query(queryStr, queryVals);
    })
    .then((res) => {
      return res.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((res) => {
    return res.rows;
  });
};

exports.fetchComments = () => {
  return db.query(`SELECT * FROM comments`).then((res) => {
    return res.rows;
  });
};

exports.removeCommentById = (comment_id) => {
  return checkCommentExists(comment_id)
    .then(() => {
      return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
        [comment_id]
      );
    })
    .then((res) => {
      return res;
    });
};
