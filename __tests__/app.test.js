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
        expect(body.review).toBeInstanceOf(Array);
        expect(body.review.length).toBe(1);
        expect(body.review[0]).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: expect.any(String),
          votes: 1,
          comment_count: 0,
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

describe("GET /api/reviews/:review_id (comment count)", () => {
  test("status: 200, responds with review object of review_id specified by clients request with comment count", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toBeInstanceOf(Array);
        expect(body.review[0]).toMatchObject({
          review_id: 2,
          title: "Jenga",
          category: "dexterity",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: expect.any(String),
          votes: 5,
          comment_count: 3,
        });
      });
  });
  test("status: 404 - Path not found, if client makes request on invalid path", () => {
    return request(app)
      .get("/api/reviewsbyid/2")
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

describe("GET /api/reviews (queries)", () => {
  test("status: 200 - responds with reviews by category value specified in query, if query omitted responds with all reviews", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        body.reviews.forEach((review) => {
          expect(review).toContainEntry(["category", "dexterity"]);
        });
        expect(body.reviews[0]).toMatchObject({
          review_id: 2,
          title: "Jenga",
          category: "dexterity",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: expect.any(String),
          votes: 5,
          comment_count: 3,
        });
      });
  });
  test("status: 200 - responds with array of reviews sorted by created_at as default, order DESC as default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status: 200 - responds with array of reviews sorted by comment_count as defined by query, order DESC as default", () => {
    return request(app)
      .get("/api/reviews?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("status: 200 - responds with array of reviews sorted by designer as defined by query, order DESC as default", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("designer", {
          descending: true,
        });
      });
  });
  test("status: 200 - responds with array of reviews by category and sorted by values defined in query, order DESC as default", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
        body.reviews.forEach((review) => {
          expect(review).toContainEntry(["category", "social deduction"]);
        });
        expect(body.reviews).toEqual([
          {
            review_id: 12,
            title: "Scythe; you're gonna need a bigger table!",
            category: "social deduction",
            designer: "Jamey Stegmaier",
            owner: "mallionaire",
            review_body:
              "Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            created_at: "2021-01-22T10:37:04.839Z",
            votes: 100,
            comment_count: 0,
          },
          {
            review_id: 13,
            title: "Settlers of Catan: Don't Settle For Less",
            category: "social deduction",
            designer: "Klaus Teuber",
            owner: "mallionaire",
            review_body:
              "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            created_at: "1970-01-10T02:08:38.400Z",
            votes: 16,
            comment_count: 0,
          },
          {
            review_id: 9,
            title: "A truly Quacking Game; Quacks of Quedlinburg",
            category: "social deduction",
            designer: "Wolfgang Warsch",
            owner: "mallionaire",
            review_body:
              "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 10,
            comment_count: 0,
          },
          {
            review_id: 10,
            title: "Build you own tour de Yorkshire",
            category: "social deduction",
            designer: "Asger Harding Granerud",
            owner: "mallionaire",
            review_body:
              "Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now your taking on exhaustion cards like there is not tomorrow, you think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoot passed? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents, cyclist can fall slyly behind front runners in their slipstreams to save precious energy for the prefect moment to burst into the lead ",
            review_img_url:
              "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 10,
            comment_count: 0,
          },
          {
            review_id: 7,
            title: "Mollit elit qui incididunt veniam occaecat cupidatat",
            category: "social deduction",
            designer: "Avery Wunzboogerz",
            owner: "mallionaire",
            review_body:
              "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
            review_img_url:
              "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            created_at: "2021-01-25T11:16:54.963Z",
            votes: 9,
            comment_count: 0,
          },
          {
            review_id: 11,
            title: "That's just what an evil person would say!",
            category: "social deduction",
            designer: "Fiona Lohoar",
            owner: "mallionaire",
            review_body:
              "If you've ever wanted to accuse your siblings, cousins or friends of being part of a plot to murder everyone whilst secretly choosing which one of them should get the chop next - this is the boardgame for you. Buyer beware: once you gain a reputation for being able to lie with a stone face about being the secret killer you may never lose it.",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 8,
            comment_count: 0,
          },
          {
            review_id: 6,
            title: "Occaecat consequat officia in quis commodo.",
            category: "social deduction",
            designer: "Ollie Tabooger",
            owner: "mallionaire",
            review_body:
              "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
            review_img_url:
              "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            created_at: "2020-09-13T14:19:28.077Z",
            votes: 8,
            comment_count: 0,
          },
          {
            review_id: 4,
            title: "Dolor reprehenderit",
            category: "social deduction",
            designer: "Gamey McGameface",
            owner: "mallionaire",
            review_body:
              "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
            review_img_url:
              "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            created_at: "2021-01-22T11:35:50.936Z",
            votes: 7,
            comment_count: 0,
          },
          {
            review_id: 8,
            title: "One Night Ultimate Werewolf",
            category: "social deduction",
            designer: "Akihisa Okui",
            owner: "mallionaire",
            review_body: "We couldn't find the werewolf!",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: 0,
          },
          {
            review_id: 5,
            title: "Proident tempor et.",
            category: "social deduction",
            designer: "Seymour Buttz",
            owner: "mallionaire",
            review_body:
              "Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing. Nostrud labore dolor fugiat sint consequat excepteur dolore irure eu. Anim ex adipisicing magna deserunt enim fugiat do nulla officia sint. Ex tempor ut aliquip exercitation eiusmod. Excepteur deserunt officia voluptate sunt aliqua esse deserunt velit. In id non proident veniam ipsum id in consequat duis ipsum et incididunt. Qui cupidatat ea deserunt magna proident nisi nulla eiusmod aliquip magna deserunt fugiat fugiat incididunt. Laboris nisi velit mollit ullamco deserunt eiusmod deserunt ea dolore veniam.",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            created_at: "2021-01-07T09:06:08.077Z",
            votes: 5,
            comment_count: 0,
          },
          {
            review_id: 3,
            title: "Ultimate Werewolf",
            category: "social deduction",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_body: "We couldn't find the werewolf!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: 3,
          },
        ]);
      });
  });
  test("status: 200 - responds with array of reviews sorted by designer in ascending order as defined by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("designer", {
          ascending: true,
        });
      });
  });
  test("status: 404 - Path not found, request made on invalid path", () => {
    return request(app)
      .get("/api/revuse?sort_by=designer")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400 - Invalid category, request made on valid path but category does not exist/ is not on green list", () => {
    return request(app)
      .get("/api/reviews?category=super%20hero")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid category");
      });
  });
  test("status: 400 - Invalid sort query, request made on valid path but sort_by column does not exist/ is not on green list", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_title")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });
  test("status: 400 - Invalid sort query order, request made on valid path but order type does not exist/ is not on green list", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=FIRST")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query order");
      });
  });
  test("status: 400 - Invalid sort query, sort_by green list protects against sql injection", () => {
    return request(app)
      .get("/api/reviews?sort_by=DROP *")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });
});

describe("GET /api/comments", () => {
  test("status: 200 - returns array of comments", () => {
    return request(app)
      .get("/api/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(6);
        expect(body.comments).toEqual([
          {
            comment_id: 1,
            body: "I loved this game too!",
            review_id: 2,
            author: "bainesface",
            votes: 16,
            created_at: "2017-11-22T12:43:33.389Z",
          },
          {
            comment_id: 2,
            body: "My dog loved this game too!",
            review_id: 3,
            author: "mallionaire",
            votes: 13,
            created_at: "2021-01-18T10:09:05.410Z",
          },
          {
            comment_id: 3,
            body: "I didn't know dogs could play games",
            review_id: 3,
            author: "philippaclaire9",
            votes: 10,
            created_at: "2021-01-18T10:09:48.110Z",
          },
          {
            comment_id: 4,
            body: "EPIC board game!",
            review_id: 2,
            author: "bainesface",
            votes: 16,
            created_at: "2017-11-22T12:36:03.389Z",
          },
          {
            comment_id: 5,
            body: "Now this is a story all about how, board games turned my life upside down",
            review_id: 2,
            author: "mallionaire",
            votes: 13,
            created_at: "2021-01-18T10:24:05.410Z",
          },
          {
            comment_id: 6,
            body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
            review_id: 3,
            author: "philippaclaire9",
            votes: 10,
            created_at: "2021-03-27T19:49:48.110Z",
          },
        ]);
      });
  });
  test("status: 404 - Path not found, client makes request on invalid path", () => {
    return request(app)
      .get("/api/showcomments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status: 204 - No content, successfully deletes comment and returns empty object", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("GET - status: 200, returns data array with length reduced by deleted comment", () => {
    return request(app)
      .get("/api/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(6);
      });
  });
  test("status: 404 - Path not found, request made on invalid path", () => {
    return request(app)
      .delete("/api/showcomments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400 - Invalid comment id, request made on valid path but comment does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment id");
      });
  });
});

describe("GET /API", () => {
  test("status: 200 - All ok", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
      });
  });
});
