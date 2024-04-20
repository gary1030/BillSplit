var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const UserControllers = require("../controllers/userControllers");

router.use(authentication);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource user");
});

/* GET user by id */
router.get("/:id", async function (req, res, next) {
  try {
    const userControllers = new UserControllers();
    const user = await userControllers.getUserById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* Get user groups */
router.get("/:id/groups", async function (req, res, next) {
  try {
    if (req.userId !== req.params.id) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const userControllers = new UserControllers();
    const groups = await userControllers.getUserGroups(req.params.id);
    res.send(groups);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

module.exports = router;
