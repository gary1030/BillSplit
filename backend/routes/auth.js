var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");

const LoginControllers = require("../controllers/loginControllers");

/* POST login. */
router.post(
  "/login",
  [check("code").isString().notEmpty()],
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: "Bad request" });
    }
    next();
  },
  LoginControllers.login
);

module.exports = router;
