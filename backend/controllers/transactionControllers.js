const PersonalTransaction = require('../models/personalTransaction');
const GroupTransaction = require('../models/groupTransaction');
const GroupRepayment = require('../models/groupRepayment');
const UserConcealedTransaction = require('../models/userConcealedTransaction');
const Currency = require('../models/currency');

class TransactionControllers {
  async createPersonalTransaction(userId, categoryId, type, title, amount) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const personalTransaction =
        await PersonalTransaction.createPersonalTransaction(
          userId,
          categoryId,
          currencyId,
          type,
          title,
          amount
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
        throw new Error('Transaction amount is not correct');
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
    return payerAmount === totalAmount && splitAmount === totalAmount;
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
      throw error;
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
}

module.exports = new TransactionControllers();
