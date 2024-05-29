const PersonalTransaction = require("../models/personalTransaction");
const Group = require("../models/group");
const GroupTransaction = require("../models/groupTransaction");
const GroupRepayment = require("../models/groupRepayment");
const UserConcealedTransaction = require("../models/userConcealedTransaction");
const Currency = require("../models/currency");
const User = require("../models/user");

class TransactionControllers {
  async createPersonalTransaction(
    userId,
    categoryId,
    // type,
    title,
    amount,
    consumptionDate,
    note
  ) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const personalTransaction =
        await PersonalTransaction.createPersonalTransaction(
          userId,
          categoryId,
          currencyId,
          // type,
          title,
          amount,
          consumptionDate,
          note
        );
      return personalTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPersonalTransactionByUserId(userId, startTime, endTime) {
    try {
      const personalTransaction =
        await PersonalTransaction.getPersonalTransactionByUserId(
          userId,
          startTime,
          endTime
        );
      return { data: personalTransaction };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPersonalTransactionById(id) {
    try {
      const personalTransaction =
        await PersonalTransaction.getPersonalTransactionById(id);
      return { data: personalTransaction };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updatePersonalTransaction(
    transactionId,
    userId,
    categoryId,
    // type,
    title,
    amount,
    consumptionDate,
    note
  ) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const updatedPersonalTransaction =
        await PersonalTransaction.updatePersonalTransactionById(
          transactionId,
          userId,
          categoryId,
          currencyId,
          // type,
          title,
          amount,
          consumptionDate,
          note
        );
      return updatedPersonalTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deletePersonalTransaction(transactionId) {
    try {
      const deletePersonalTransaction =
        await PersonalTransaction.deletePersonalTransactionById(transactionId);
      return deletePersonalTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createGroupTransaction(
    groupId,
    categoryId,
    title,
    totalAmount,
    payerDetails,
    splitDetails,
    note,
    consumptionDate
  ) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      if (
        !this.checkTransactionAmount(payerDetails, splitDetails, totalAmount)
      ) {
        throw new Error("Transaction amount is not correct");
      }
      const groupTransaction = await GroupTransaction.createGroupTransaction({
        groupId,
        categoryId,
        currencyId,
        title,
        totalAmount,
        payerDetails,
        splitDetails,
        note,
        consumptionDate,
      });
      return groupTransaction;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  checkTransactionAmount(payerDetails, splitDetails, totalAmount) {
    let payerAmount = 0;
    let splitAmount = 0;
    for (let i = 0; i < payerDetails.length; i++) {
      payerAmount += payerDetails[i].amount;
    }
    for (let i = 0; i < splitDetails.length; i++) {
      splitAmount += splitDetails[i].amount;
    }
    return (
      parseFloat(payerAmount.toFixed(2)) === totalAmount &&
      parseFloat(splitAmount.toFixed(2)) === totalAmount
    );
  }

  async getGroupTransactions(groupId, startTime, endTime) {
    try {
      const groupTransactions =
        await GroupTransaction.getGroupTransactionsByGroupId(
          groupId,
          startTime,
          endTime
        );

      return { data: groupTransactions };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getGroupTransactionById(id) {
    try {
      const groupTransaction = await GroupTransaction.getGroupTransactionById(
        id
      );

      return { data: groupTransaction };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateGroupTransaction(
    transactionId,
    groupId,
    categoryId,
    title,
    totalAmount,
    payerDetails,
    splitDetails,
    note,
    consumptionDate
  ) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const updatedGroupTransaction =
        await GroupTransaction.updateGroupTransactionById(
          transactionId,
          groupId,
          categoryId,
          currencyId,
          title,
          totalAmount,
          payerDetails,
          splitDetails,
          note,
          consumptionDate
        );

      return updatedGroupTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteGroupTransaction(transactionId) {
    try {
      const deleteGroupTransaction =
        await GroupTransaction.deleteGroupTransactionById(transactionId);
      return deleteGroupTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createGroupRepayment(groupId, payerId, receiverId, amount) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const groupRepayment = await GroupRepayment.createGroupRepayment(
        groupId,
        currencyId,
        payerId,
        receiverId,
        amount
      );
      return groupRepayment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getGroupRepayments(groupId) {
    try {
      const groupRepayments = await GroupRepayment.getGroupRepaymentsByGroupId(
        groupId
      );

      return { data: groupRepayments };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getGroupRepaymentById(id) {
    try {
      const groupRepayment = await GroupRepayment.getGroupRepaymentById(id);

      return { data: groupRepayment };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateGroupRepayment(
    repaymentId,
    groupId,
    payerId,
    receiverId,
    amount
  ) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const updatedGroupRepayment =
        await GroupRepayment.updateGroupRepaymentById(
          repaymentId,
          groupId,
          currencyId,
          payerId,
          receiverId,
          amount
        );

      return updatedGroupRepayment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteGroupRepayment(repaymentId) {
    try {
      const deleteGroupRepayment =
        await GroupRepayment.deleteGroupRepaymentById(repaymentId);
      return deleteGroupRepayment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createUserConcealedTransaction(userId, groupTransactionId) {
    try {
      const userConcealedTransaction =
        await UserConcealedTransaction.createUserConcealedTransaction(
          userId,
          groupTransactionId
        );
      return userConcealedTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserConcealedTransactionByUserId(userId, startTime, endTime) {
    try {
      const userConcealedTransaction =
        await UserConcealedTransaction.getUserConcealedTransactionByUserId(
          userId,
          startTime,
          endTime
        );
      return { data: userConcealedTransaction };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPersonalStatisticsByGroup(userId, groupId) {
    try {
      const groupTransactions =
        await GroupTransaction.getGroupTransactionsByGroupId(groupId);
      const groupRepayments =
        await GroupRepayment.getGroupRepaymentsByGroupIdAndUserId(
          groupId,
          userId
        );
      let share = 0;
      let balance = 0;

      groupTransactions.forEach((transaction) => {
        transaction.payerDetails.forEach((payerDetail) => {
          if (payerDetail.payerId === userId) {
            balance -= payerDetail.amount;
          }
        });

        transaction.splitDetails.forEach((splitDetail) => {
          if (splitDetail.sharerId === userId) {
            balance += splitDetail.amount;
            share += splitDetail.amount;
          }
        });
      });

      groupRepayments.forEach((repayment) => {
        if (repayment.payerId === userId) {
          balance -= repayment.amount;
        } else {
          balance += repayment.amount;
        }
      });

      return { group_id: groupId, share, balance };
    } catch (error) {
      throw error;
    }
  }

  async getGroupAnalysis(groupId) {
    try {
      const groupTransactions =
        await GroupTransaction.getGroupTransactionsByGroupId(groupId);
      let total = 0;

      const analysis = groupTransactions.reduce((acc, item) => {
        if (acc[item.categoryId]) {
          acc[item.categoryId] += item.totalAmount;
        } else {
          acc[item.categoryId] = item.totalAmount;
        }
        total += item.totalAmount;
        return acc;
      }, {});

      return { analysis, total };
    } catch (error) {
      throw error;
    }
  }

  async getGroupPersonalAnalysis(groupId, userId) {
    try {
      const groupTransactions =
        await GroupTransaction.getGroupTransactionsByGroupId(groupId);
      let total = 0;

      const analysis = groupTransactions.reduce((acc, item) => {
        let userSplit = item.splitDetails.filter(
          (obj) => obj.sharerId == userId
        );
        const sum = userSplit.reduce((acc, split) => {
          acc += split.amount;
          return acc;
        }, 0);

        if (acc[item.categoryId]) {
          acc[item.categoryId] += sum;
        } else {
          acc[item.categoryId] = sum;
        }
        total += sum;
        return acc;
      }, {});

      return { analysis, total };
    } catch (error) {
      throw error;
    }
  }

  async getGroupStatistics(groupId) {
    try {
      const groupTransactions =
        await GroupTransaction.getGroupTransactionsByGroupId(groupId);
      const groupRepayments = await GroupRepayment.getGroupRepaymentsByGroupId(
        groupId
      );
      const group = await Group.getGroupById(groupId);
      const userIds = group.memberIds;
      let share = {};
      let balance = {};

      userIds.forEach((userId) => {
        share[userId] = 0;
        balance[userId] = 0;
      });

      groupTransactions.forEach((transaction) => {
        transaction.payerDetails.forEach((payerDetail) => {
          balance[payerDetail.payerId] -= payerDetail.amount;
        });

        transaction.splitDetails.forEach((splitDetail) => {
          balance[splitDetail.sharerId] += splitDetail.amount;
          share[splitDetail.sharerId] += splitDetail.amount;
        });
      });

      groupRepayments.forEach((repayment) => {
        balance[repayment.payerId] -= repayment.amount;
        balance[repayment.receiverId] += repayment.amount;
      });

      userIds.forEach((userId) => {
        share[userId] = Math.round(share[userId] * 100) / 100;
        balance[userId] = Math.round(balance[userId] * 100) / 100;
      });

      return { groupId, share, balance };
    } catch (error) {
      throw error;
    }
  }

  async getGroupBalanceAndDebts(groupId) {
    try {
      const groupTransactions =
        await GroupTransaction.getGroupTransactionsByGroupId(groupId);
      const groupRepayments = await GroupRepayment.getGroupRepaymentsByGroupId(
        groupId
      );
      const group = await Group.getGroupById(groupId);
      const userIds = group.memberIds;
      let balanceAndDebts = {};
      let balanceForCalculation = {};

      userIds.forEach((userId) => {
        balanceAndDebts[userId] = { balance: 0, debts: [] };
        balanceForCalculation[userId] = 0;
      });

      groupTransactions.forEach((transaction) => {
        transaction.payerDetails.forEach((payerDetail) => {
          balanceAndDebts[payerDetail.payerId].balance -= payerDetail.amount;
          balanceForCalculation[payerDetail.payerId] -= payerDetail.amount;
        });

        transaction.splitDetails.forEach((splitDetail) => {
          balanceAndDebts[splitDetail.sharerId].balance += splitDetail.amount;
          balanceForCalculation[splitDetail.sharerId] += splitDetail.amount;
        });
      });

      groupRepayments.forEach((repayment) => {
        balanceAndDebts[repayment.payerId].balance -= repayment.amount;
        balanceAndDebts[repayment.receiverId].balance += repayment.amount;
        balanceForCalculation[repayment.payerId] -= repayment.amount;
        balanceForCalculation[repayment.receiverId] += repayment.amount;
      });

      userIds.forEach((userId) => {
        balanceAndDebts[userId].balance =
          Math.round(balanceAndDebts[userId].balance * 100) / 100;
      });

      let debtors = [];
      let creditors = [];
      for (let userId in balanceAndDebts) {
        if (balanceForCalculation[userId] >= 0.01) {
          debtors.push(userId);
        } else if (balanceForCalculation[userId] <= -0.01) {
          creditors.push(userId);
        }
        else {
          balanceAndDebts[userId].balance = 0;
        }
      }

      while (debtors.length > 0 && creditors.length > 0) {
        debtors.sort(
          (a, b) => balanceForCalculation[b] - balanceForCalculation[a]
        );
        creditors.sort(
          (a, b) => balanceForCalculation[a] - balanceForCalculation[b]
        );

        let debtor = debtors[0];
        let creditor = creditors[0];
        let amount =
          Math.round(
            Math.min(
              Math.abs(balanceForCalculation[debtor]),
              Math.abs(balanceForCalculation[creditor])
            ) * 100
          ) / 100;

        let simulatedRepayment = {
          payerId: debtor,
          receiverId: creditor,
          amount: amount,
        };
        balanceAndDebts[debtor].debts.push(simulatedRepayment);
        balanceAndDebts[creditor].debts.push(simulatedRepayment);

        balanceForCalculation[debtor] -= amount;
        balanceForCalculation[creditor] += amount;
        if (balanceForCalculation[debtor] < 0.01) {
          debtors.shift();
        }
        if (balanceForCalculation[creditor] > -0.01) {
          creditors.shift();
        }
      }

      let data = [];
      for (let userId in balanceAndDebts) {
        data.push({
          userId: userId,
          balance: balanceAndDebts[userId].balance,
          debts: balanceAndDebts[userId].debts,
        });
      }

      return { data: data };
    } catch (error) {
      throw error;
    }
  }

  async getUserAnalysis(userId, startTime, endTime) {
    try {
      const personalTransactions =
        await PersonalTransaction.getPersonalTransactionByUserId(
          userId,
          startTime,
          endTime
        );

      const groups = await User.getUserGroups(userId);
      const groupIds = groups.map((group) => group.id);

      let groupTransactions = [];
      for (let i = 0; i < groupIds.length; i++) {
        const transactions =
          await GroupTransaction.getGroupTransactionsByGroupId(
            groupIds[i],
            startTime,
            endTime
          );
        groupTransactions = groupTransactions.concat(transactions);
      }

      let total = 0;
      let analysis = {};

      personalTransactions.forEach((transaction) => {
        if (analysis[transaction.categoryId]) {
          analysis[transaction.categoryId] += transaction.amount;
        } else {
          analysis[transaction.categoryId] = transaction.amount;
        }
        total += transaction.amount;
      });

      groupTransactions.forEach((transaction) => {
        transaction.splitDetails.forEach((splitDetail) => {
          if (splitDetail.sharerId === userId) {
            if (analysis[transaction.categoryId]) {
              analysis[transaction.categoryId] += splitDetail.amount;
            } else {
              analysis[transaction.categoryId] = splitDetail.amount;
            }
            total += splitDetail.amount;
          }
        });
      });

      return { analysis, total };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TransactionControllers();
