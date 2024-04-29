const PersonalTransaction = require("../models/personalTransaction");
const GroupTransaction = require("../models/groupTransaction");
const GroupRepayment = require("../models/groupRepayment");
const Currency = require("../models/currency");

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
    userId,
    groupId,
    categoryId,
    title,
    totalAmount,
    payerDetails,
    splitDetails
  ) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      if (
        !this.checkTransactionAmount(payerDetails, splitDetails, totalAmount)
      ) {
        throw new Error("Transaction amount is not correct");
      }
      const groupTransaction = await GroupTransaction.createGroupTransaction({
        userId,
        groupId,
        categoryId,
        currencyId,
        title,
        totalAmount,
        payerDetails,
        splitDetails,
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

  async createGroupRepayment(userId, groupId, payerId, receiverId, amount) {
    try {
      const currencyId = await Currency.getDefaultCurrencyId();
      const groupRepayment = await GroupRepayment.createGroupRepayment({
        userId,
        groupId,
        currencyId,
        payerId,
        receiverId,
        amount,
      });
      return groupRepayment;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getGroupRepayments(groupId, startTime, endTime) {
    try {
      const groupRepayments = await GroupRepayment.getGroupRepaymentsByGroupId(
        groupId,
        startTime,
        endTime
      );

      return { data: groupRepayments };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateGroupRepayment(repaymentId, data) {
    try {
      const updatedGroupRepayment =
        await GroupRepayment.updateGroupRepaymentById(repaymentId, data);

      return updatedGroupRepayment;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new TransactionControllers();
