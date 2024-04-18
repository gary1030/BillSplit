var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

router.use(authentication);

/* GET users listing. */
router.get("/", authentication, function (req, res, next) {
  res.send("respond with a resource user");
});


module.exports = router;
