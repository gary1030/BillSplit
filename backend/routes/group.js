var express = require("express");
var router = express.Router();
var authentication = require("../middlewares/auth");

const GroupControllers = require("../controllers/groupControllers");
const TransactionControllers = require("../controllers/transactionControllers");
const groupTransaction = require("../models/groupTransaction");

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
      res.status(400).json({ message: "Amount should be a positive number!" });
      return;
    }

    // check title
    if (req.body.title === "") {
      res.status(400).json({ message: "Title is required!" });
      return;
    }

    const groupTransaction =
      await TransactionControllers.createGroupTransaction(
        req.params.id,
        req.body.categoryId,
        req.body.title,
        req.body.totalAmount,
        req.body.payerDetails,
        req.body.splitDetails,
        req.body.note,
        req.body.consumptionDate
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

    var startTime = req.query.startTime;
    var endTime = req.query.endTime;

    // check start time and end time and format
    if (startTime === undefined || endTime === undefined) {
      startTime = new Date(0); // January 1, 1970
      endTime = new Date();
      endTime.setFullYear(endTime.getFullYear() + 1);
    } else if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
      res.status(400).json({ message: "Start time and end time are illegal!" });
      return;
    }

    const groupTransactions = await TransactionControllers.getGroupTransactions(
      req.params.id,
      startTime,
      endTime
    );

    res.send(groupTransactions);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET group transaction by id */
router.get("/:id/transactions/:transactionId", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const groupTransaction =
      await TransactionControllers.getGroupTransactionById(
        req.params.transactionId
      );
    res.send(groupTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* PUT update group transaction */
router.put("/:id/transactions/:transactionId", async function (req, res, next) {
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
    if (req.body.totalAmount <= 0) {
      res.status(400).json({ message: "Amount should be a positive number!" });
      return;
    }

    // check title
    if (req.body.title === "") {
      res.status(400).json({ message: "Title is required!" });
      return;
    }

    const updatedGroupTransaction =
      await TransactionControllers.updateGroupTransaction(
        req.params.transactionId,
        req.params.id,
        req.body.categoryId,
        req.body.title,
        req.body.totalAmount,
        req.body.payerDetails,
        req.body.splitDetails,
        req.body.note,
        req.body.consumptionDate
      );

    res.send(updatedGroupTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

/* DELETE delete group transactions */
router.delete(
  "/:id/transactions/:transactionId",
  async function (req, res, next) {
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

      const deleteGroupTransaction =
        await TransactionControllers.deleteGroupTransaction(
          req.params.transactionId
        );

      res.send(deleteGroupTransaction);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Cannot delete!" });
    }
  }
);

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

    // check payer in group
    const isPayerInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.body.payerId
    );
    if (!isPayerInGroup) {
      res.status(400).json({ message: "Payer is not in group!" });
      return;
    }

    // check receiver in group
    const isReceiverInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.body.receiverId
    );
    if (!isReceiverInGroup) {
      res.status(400).json({ message: "Receiver is not in group!" });
      return;
    }

    // check amount
    // amount must be positive
    if (req.body.amount <= 0) {
      res.status(400).json({ message: "Amount must be a positive number!" });
      return;
    }

    // check payerId
    if (req.body.payerId === undefined) {
      res.status(400).json({ message: "PayerId is required!" });
      return;
    }

    // check receiverId
    if (req.body.receiverId === "") {
      res.status(400).json({ message: "ReceiverId is required!" });
      return;
    }

    const groupRepayment = await TransactionControllers.createGroupRepayment(
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
    res.status(400).json({ message: "Bad Request" });
  }
});

/* GET group repayment by id */
router.get("/:id/repayments/:repaymentId", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const groupRepayment = await TransactionControllers.getGroupRepaymentById(
      req.params.repaymentId
    );
    res.send(groupRepayment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
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
    // amount must be positive
    if (req.body.amount <= 0) {
      res.status(400).json({ message: "Amount should be a positive number!" });
      return;
    }

    // check payerId
    if (req.body.payerId === undefined) {
      res.status(400).json({ message: "PayerId is required!" });
      return;
    }

    // check receiverId
    if (req.body.receiverId === undefined) {
      res.status(400).json({ message: "ReceiverId is required!" });
      return;
    }

    const updatedGroupRepayment =
      await TransactionControllers.updateGroupRepayment(
        req.params.repaymentId,
        req.params.id,
        req.body.payerId,
        req.body.receiverId,
        req.body.amount
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

/* Get group analysis */
router.get("/:id/analysis/group", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const data = await TransactionControllers.getGroupAnalysis(req.params.id);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* Get personal analysis */
router.get("/:id/analysis/personal", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const data = await TransactionControllers.getGroupPersonalAnalysis(
      req.params.id,
      req.userId
    );
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* Get group statistics */
router.get("/:id/stat", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const data = await TransactionControllers.getGroupStatistics(req.params.id);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

/* Get group balance and debts */
router.get("/:id/balanceDebts", async function (req, res, next) {
  try {
    const isUserInGroup = await GroupControllers.isUserInGroup(
      req.params.id,
      req.userId
    );
    if (!isUserInGroup) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const data = await TransactionControllers.getGroupBalanceAndDebts(
      req.params.id
    );
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

module.exports = router;
