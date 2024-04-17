var express = require("express");
var router = express.Router();

const LoginControllers = require("../controllers/loginControllers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource user");
});

/* POST login. */
router.post("/login", async function (req, res, next) {
  try {
    const loginControllers = new LoginControllers();
    const user = await loginControllers.login(req.body.code);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
