var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const GroupControllers = require("../controllers/groupControllers");

router.use(authentication);

/* POST create group */
router.post("/", async function (req, res, next) {
  try {
    const groupControllers = new GroupControllers();
    if (req.body.name === undefined) {
      res.status(400).json({ message: "Name is required!" });
      return;
    }
    const group = await groupControllers.createGroup(req.body.name, req.userId);
    res.send(group);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

/* GET group by id */
router.get("/:id", async function (req, res, next) {
  try {
    const groupControllers = new GroupControllers();
    const group = await groupControllers.getGroupById(
      req.params.id,
      req.userId
    );
    res.send(group);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized!" });
  }
});

module.exports = router;
