const seed = require("../db/seeds/seed");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../db/app.js");
const testData = require("../db/data/test-data/index.js");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("status: 200, responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories.length).toBe(4);
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    return request(app)
      .get("/api/categorys")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/reviews", () => {
  test("status: 200, responds with array of review objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews.length).toBe(13);
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    return request(app)
      .get("/api/revoows")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});

describe("Get /api/reviews/:review_id", () => {
  test("status: 200 - responds with a review object of review_id specified by clients request", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(1);
        body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            review_id: 1,
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    return request(app)
      .get("/api/reviewsbyid/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400 - Invalid review id, if client makes request on valid path but no review exists", () => {
    return request(app)
      .get("/api/reviews/99")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid review id");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status: 200 - returns comment object that corresponds with review_id stated by clients request", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(3);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        body.reviews.forEach((comment) => {
          expect(comment).toBeInstanceOf(Object);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            review_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    return request(app)
      .get("/api/reviews/1/showcomments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400 - Invalid review id, if client makes request on valid path but no review exists", () => {
    return request(app)
      .get("/api/reviews/99/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid review id");
      });
  });
  test("status: 200 - returns empty array if client makes request on valid path and review exists but no comments exist", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual([]);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("status 201: Comment added successfully", () => {
    const newComment = {
      username: "bainesface",
      body: "This boardgame stole my shoes",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 7,
          review_id: 2,
          body: "This boardgame stole my shoes",
          votes: 0,
          author: "bainesface",
          created_at: expect.any(String),
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    const newComment = {
      username: "bainesface",
      body: "This boardgame stole my shoes",
    };
    return request(app)
      .post("/api/reviews/2/showcomments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400 - Invalid review id, if client makes request on valid path but no review exists", () => {
    const newComment = {
      username: "bainesface",
      body: "This boardgame stole my shoes",
    };
    return request(app)
      .post("/api/reviews/99/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid review id");
      });
  });
  test("status: 400 - Bad request, if client tries to make post request with malformed body or body is missing required fields", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status: 400 - Bad request, if client's post request uses invalid data types", () => {
    const newComment = {
      username: 500,
      body: {},
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status: 400 - Bad request, if client's request uses valid data type but invalid username", () => {
    const newComment = { username: "steve", body: "steve's comment" };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status: 200 - Patch successful", () => {
    const newPatch = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newPatch)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toBeInstanceOf(Object);
        expect(body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: expect.any(String),
          votes: 11,
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    const newPatch = { inc_votes: 10 };
    return request(app)
      .patch("/api/revuse/1")
      .send(newPatch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400 - Invalid review id, if client makes request on valid path but no review exists", () => {
    const newPatch = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/999")
      .send(newPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid review id");
      });
  });
  test("status: 400 - Bad request, if clients request is made with malformed body or body is missing required fields", () => {
    const newPatch = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(newPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status: 400 - Bad request, if client's request uses incorrect key in object", () => {
    const newPatch = { update_votes: 10 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status: 400 - Bad request, if client's request uses invalid data types", () => {
    const newPatch = { inc_votes: "yes" };
    return request(app)
      .patch("/api/reviews/1")
      .send(newPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  test("status: 200, responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    return request(app)
      .get("/api/findusers")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
