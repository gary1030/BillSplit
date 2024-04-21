var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const UserControllers = require("../controllers/userControllers");
const TransactionControllers = require("../controllers/transactionControllers");

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

/* POST create personal transaction */
router.post("/:id/transactions", async function (req, res, next) {
  try {
    if (req.userId !== req.params.id) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    // check type
    if (req.body.type !== "INCOME" && req.body.type !== "EXPENSE") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    // check amount
    if (req.body.amount <= 0) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    // check title
    if (req.body.title === "") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    const transactionControllers = new TransactionControllers();
    const personalTransaction =
      await transactionControllers.createPersonalTransaction(
        req.userId,
        req.body.categoryId,
        req.body.type,
        req.body.title,
        req.body.amount
      );
    res.send(personalTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET user personal transactions*/
router.get("/:id/transactions", async function (req, res, next) {
  try {
    if (req.userId !== req.params.id) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    // check start time and end time and format
    if (
      req.query.startTime === undefined ||
      req.query.endTime === undefined ||
      isNaN(Date.parse(req.query.startTime)) ||
      isNaN(Date.parse(req.query.endTime))
    ) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    const transactionControllers = new TransactionControllers();
    const personalTransactions =
      await transactionControllers.getPersonalTransactionByUserId(
        req.userId,
        req.query.startTime,
        req.query.endTime
      );
    res.send(personalTransactions);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

module.exports = router;
