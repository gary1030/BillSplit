var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const GroupControllers = require("../controllers/groupControllers");
const TransactionControllers = require("../controllers/transactionControllers");

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

/* POST create group transaction */
router.post("/:id/transactions", async function (req, res, next) {
  try {
    // check user in group
    const groupControllers = new GroupControllers();
    const isUserInGroup = await groupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
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
    const groupTransaction =
      await transactionControllers.createGroupTransaction(
        req.userId,
        req.params.id,
        req.body.categoryId,
        req.body.title,
        req.body.amount,
        req.body.payerDetails,
        req.body.splitDetails
      );
    res.send(groupTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET group transactions */
router.get("/:id/transactions", async function (req, res, next) {
  try {
    const groupControllers = new GroupControllers();
    const isUserInGroup = await groupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const transactionControllers = new TransactionControllers();
    const groupTransactions = await transactionControllers.getGroupTransactions(
      req.params.id
    );
    res.send(groupTransactions);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized!" });
  }
});

module.exports = router;
