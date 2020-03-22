const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const usersDB = require("./databases/UsersDB.js");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
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
    req.session.userID = user.id

    res.send("");
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log("> Listening on localhost:3000");
  });
});