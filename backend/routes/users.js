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

/* GET user in batch */
router.get("/batch", async function (req, res, next) {
  try {
    // check ids is not empty
    if (req.query.ids === undefined) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    // transform ids to array
    const ids = req.query.ids.split(",");

    const users = await UserControllers.getUsersInBatch(ids);
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET user by id */
router.get("/:id", async function (req, res, next) {
  try {
    const user = await UserControllers.getUserById(req.params.id);
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

    const groups = await UserControllers.getUserGroups(req.params.id);
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
      res.status(400).json({ message: "Type must be INCOME or EXPENSE" });
      return;
    }

    // check amount
    if (req.body.amount <= 0) {
      res.json(400).json({ message: "Amount should be a positive number!" });
      return;
    }

    // check title
    if (req.body.title === "") {
      res.status(400).json({ message: "Title is required!" });
      return;
    }

    const personalTransaction =
      await TransactionControllers.createPersonalTransaction(
        req.params.id,
        req.body.categoryId,
        req.body.type,
        req.body.title,
        req.body.amount,
        req.body.consumptionDate
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

    var startTime = req.query.startTime;
    var endTime = req.query.endTime;

    // check start time and end time and format
    if (startTime === undefined || endTime === undefined) {
      startTime = new Date(0); // January 1, 1970
      endTime = new Date();
    } else if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
      res.status(400).json({ message: "Start time and end time are illegal!" });
      return;
    }

    const personalTransactions =
      await TransactionControllers.getPersonalTransactionByUserId(
        req.params.id,
        startTime,
        endTime
      );
    res.send(personalTransactions);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET user personal transaction by id */
router.get("/:id/transactions/:transactionId", async function (req, res, next) {
  try {
    if (req.userId !== req.params.id) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const personalTransaction =
      await TransactionControllers.getPersonalTransactionById(
        req.params.transactionId
      );
    res.send(personalTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* PUT update user personal transaction */
router.put("/:id/transactions/:transactionId", async function (req, res, next) {
  try {
    if (req.userId !== req.params.id) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    // check type
    if (req.body.type !== "INCOME" && req.body.type !== "EXPENSE") {
      res.status(400).json({ message: "Type must be INCOME or EXPENSE" });
      return;
    }

    // check amount
    if (req.body.amount <= 0) {
      res.json(400).json({ message: "Amount should be a positive number!" });
      return;
    }

    // check title
    if (req.body.title === "") {
      res.status(400).json({ message: "Title is required!" });
      return;
    }

    const personalTransaction =
      await TransactionControllers.updatePersonalTransaction(
        req.params.transactionId,
        req.params.id,
        req.body.categoryId,
        req.body.type,
        req.body.title,
        req.body.amount,
        req.body.consumptionDate
      );
    res.send(personalTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* POST create user concealed transaction */
router.post("/:id/concealedTransactions", async function (req, res, next) {
  try {
    if (req.userId !== req.params.id) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const userConcealedTransaction =
      await TransactionControllers.createUserConcealedTransaction(
        req.userId,
        req.body.groupTransactionId
      );
    res.send(userConcealedTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* DELETE user personal transaction */
router.delete(
  "/:id/transactions/:transactionId",
  async function (req, res, next) {
    try {
      if (req.userId !== req.params.id) {
        res.status(401).json({ message: "Unauthorized!" });
        return;
      }

      const personalTransaction =
        await TransactionControllers.deletePersonalTransaction(
          req.params.transactionId
        );
      res.send(personalTransaction);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Bad Request" });
    }
  }
);

/* GET user concealed transactions */
router.get("/:id/concealedTransactions", async function (req, res, next) {
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

    const userConcealedTransactions =
      await TransactionControllers.getUserConcealedTransactionByUserId(
        req.userId,
        req.query.startTime,
        req.query.endTime
      );
    res.send(userConcealedTransactions);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

module.exports = router;
