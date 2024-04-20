var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const CategoryControllers = require("../controllers/categoryControllers");

router.use(authentication);

/* GET all categories */
router.get("/", async function (req, res, next) {
  try {
    const categoryControllers = new CategoryControllers();
    const categories = await categoryControllers.getAllCategories();
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
