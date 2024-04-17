var express = require("express");
var router = express.Router();

const User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource user");
});

/* POST login. */
// TODO: implement google oauth
router.post("/login", async function (req, res, next) {
  // connect to prisma db and check if user exists
  const email = "line@gmail.com";
  const username = "kk";

  // generate random id string
  const googleUserId = Math.random().toString(36).substring(7);

  try {
    const userModel = new User();
    const user = await userModel.createUser(username, email, googleUserId);
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

module.exports = router;
