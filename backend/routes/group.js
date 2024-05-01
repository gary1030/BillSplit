var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const GroupControllers = require("../controllers/groupControllers");
const TransactionControllers = require("../controllers/transactionControllers");

router.use(authentication);

/* POST create group */
router.post("/", async function (req, res, next) {
  try {
    if (req.body.name === undefined) {
      res.status(400).json({ message: "Name is required!" });
      return;
    }

    if (req.body.theme === undefined) {
      res.status(400).json({ message: "Theme is required!" });
      return;
    }

    const group = await GroupControllers.createGroup(
      req.body.name,
      req.userId,
      req.body.theme
    );
    res.send(group);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

/* GET group by id */
router.get("/:id", async function (req, res, next) {
  try {
    const group = await GroupControllers.getGroupById(
      req.params.id,
      req.userId
    );
    res.send(group);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* PUT edit group */
router.put("/:id", async function (req, res, next) {
  try {
    if (req.body.name === undefined) {
      res.status(400).json({ message: "Name is required!" });
      return;
    }

    if (req.body.theme === undefined) {
      res.status(400).json({ message: "Theme is required!" });
      return;
    }

    // check user in group
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const updatedGroup = await GroupControllers.editGroup(
      req.params.id,
      req.body.name,
      req.body.theme
    );
    res.send(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

/* POST join group */
router.post("/:groupId/join", async function (req, res, next) {
  try {
    const updatedGroup = await GroupControllers.addGroupMember(
      req.params.groupId,
      req.userId
    );
    res.send(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* POST create group transaction */
router.post("/:id/transactions", async function (req, res, next) {
  try {
    // check user in group
    const isUserInGroup = await GroupControllers.isUserInGroup(
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

    const groupTransaction =
      await TransactionControllers.createGroupTransaction(
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
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const groupTransactions = await TransactionControllers.getGroupTransactions(
      req.params.id
    );
    res.send(groupTransactions);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized!" });
  }
});

/* POST create group repayments */
router.post("/:id/repayments", async function (req, res, next) {
  try {
    // check user in group
    const isUserInGroup = await GroupControllers.isUserInGroup(
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

    // check payerId
    if (req.body.payerId === "") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    // check receiverId
    if (req.body.receiverId === "") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    const groupRepayment = await TransactionControllers.createGroupRepayment(
      req.userId,
      req.params.id,
      req.body.payerId,
      req.body.receiverId,
      req.body.amount
    );
    res.send(groupRepayment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET group repayments */
router.get("/:id/repayments", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const groupRepayments = await TransactionControllers.getGroupRepayments(
      req.params.id
    );
    res.send(groupRepayments);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized!" });
  }
});

/* PUT update group repayments */
router.put("/:id/repayments/:repaymentId", async function (req, res, next) {
  try {
    // check user in group
    const isUserInGroup = await GroupControllers.isUserInGroup(
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

    // check payerId
    if (req.body.payerId === "") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    // check receiverId
    if (req.body.receiverId === "") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    const updatedGroupRepayment =
      await TransactionControllers.updateGroupRepayment(
        req.params.repaymentId,
        {
          payerId: req.body.payerId,
          receiverId: req.body.receiverId,
          amount: req.body.amount,
        }
      );

    res.send(updatedGroupRepayment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* DELETE delete group repayments */
router.delete("/:id/repayments/:repaymentId", async function (req, res, next) {
  try {
    // check user in group
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const deleteGroupRepayment =
      await TransactionControllers.deleteGroupRepayment(req.params.repaymentId);

    res.send(deleteGroupRepayment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cannot delete!" });
  }
});

/* Get personal statistics */
router.get("/:id/personal-stat", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const personalStatistics =
      await TransactionControllers.getPersonalStatisticsByGroup(
        req.userId,
        req.params.id
      );
    res.send(personalStatistics);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

module.exports = router;
