var express = require("express");
var router = express.Router();

const LoginControllers = require("../controllers/loginControllers");

/* POST login. */
router.post("/login", async function (req, res, next) {
  try {
    const loginControllers = new LoginControllers();
    const user = await loginControllers.login(req.body.code);
    res.send(user);
  } catch (error) {
    console.log("Unauthorized client: ", error)
    res.status(401).json({ message: 'Unauthorized!' });
  }
});

module.exports = router;
