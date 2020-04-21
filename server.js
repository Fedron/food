const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const usersDB = require("./databases/UsersDB.js");
const timeframesDB = require("./databases/TimeframesDB.js");
const foodsDB = require("./databases/FoodsDB.js");
const categoriesDB = require("./databases/CategoriesDB.js");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const requireAuth = (req, res, next) => {
  if (!req.session.userID) {
    return res.redirect("/signin");
  }
  next();
}

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json({ limit: "10mb" }));
  server.use(cookieSession({
    keys: ["e5ior269rsgflhb32sngd"]
  }));

  server.post("/signup", async (req, res) => {
    const { username, password, passwordConf } = req.body;

    if (!username || !password || !passwordConf) {
      res.statusMessage = "Fields cannot be left blank";
      return res.status(400).send("");
    }

    const existingUser = await usersDB.getBy({ username });
    if (existingUser) {
      res.statusMessage = "Username already taken.";
      return res.status(400).send("");
    }

    const user = await usersDB.create({ username, password });
    req.session.userID = user.id;
    
    await timeframesDB.create({
      id: user.id,
      timeframes: []
    });

    await categoriesDB.create({
      id: user.id,
      categories: []
    });

    await foodsDB.create({
      id: user.id,
      foods: []
    });

    res.send("");
  });

  server.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.statusMessage = "Fields cannot be left blank";
      return res.status(400).send("");
    }

    const user = await usersDB.getBy({ username });
    if (!user) {
      res.statusMessage = "Password incorrect";
      return res.status(400).send("");
    }

    if (!await usersDB.comparePasswords(user.password, password)) {
      res.statusMessage = "Password incorrect";
      return res.status(400).send("");
    }

    req.session.userID = user.id;
    res.send("");
  });

  server.get("/signout", (req, res) => {
    req.session = null;
    res.redirect("/signin");
  });

  server.get("/", requireAuth, (req, res) => { return app.render(req, res, "/") }
  );

  server.post("/db/timeframes/save", requireAuth, async (req, res) => {
    console.log(req.body);
    await timeframesDB.update(req.session.userID, req.body);
    res.send("");
  });
  
  server.post("/db/timeframes/delete", requireAuth, async (req, res) => {
    await timeframesDB.delete(req.session.userID, req.body.id);
    res.send("");
  });

  server.post("/db/categorys/save", requireAuth, async (req, res) => {
    await categoriesDB.update(req.session.userID, req.body);
    res.send("");
  });

  server.post("/db/categorys/delete", requireAuth, async (req, res) => {
    await categoriesDB.delete(req.session.userID, req.body.id);
    res.send("");
  });

  server.post("/db/foods/save", requireAuth, async (req, res) => {
    let newCategories = [];
    for (let category of req.body.categories) {
      const c = await categoriesDB.getBy(req.session.userID, { name: category });
      if (!c) { newCategories.push(category); continue; }
      newCategories.push(c.id);
    }
    req.body.categories = newCategories;

    await foodsDB.update(req.session.userID, req.body);
    res.send("");
  });

  server.post("/db/foods/image/save", requireAuth, async (req, res) => {
    await foodsDB.addImage(req.session.userID, req.body);
    res.send("");
  });

  server.post("/db/foods/delete", requireAuth, async (req, res) => {
    await foodsDB.delete(req.session.userID, req.body.id);
    res.send("");
  });

  server.post("/db/foods/used", requireAuth, async (req, res) => {
    const time = Date.now();
    await foodsDB.updateTimesUsed(req.session.userID, req.body.id, time);
    res.send("");
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, "192.168.1.20", err => {
    if (err) throw err;
    console.log("> Listening...");
  });
});