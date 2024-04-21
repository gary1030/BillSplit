const PersonalTransaction = require("../models/personalTransaction");
const GroupTransaction = require("../models/groupTransaction");
const Currency = require("../models/currency");
const e = require("express");

class TransactionControllers {
  constructor() {
    this.personalTransactionModel = new PersonalTransaction();
    this.groupTransactionModel = new GroupTransaction();
    this.currencyModel = new Currency();
  }

  async createPersonalTransaction(userId, categoryId, type, title, amount) {
    try {
      const currencyId = await this.currencyModel.getDefaultCurrencyId();
      const personalTransaction =
        await this.personalTransactionModel.createPersonalTransaction(
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
        await this.personalTransactionModel.getPersonalTransactionByUserId(
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
      const currencyId = await this.currencyModel.getDefaultCurrencyId();
      if (
        !this.checkTransactionAmount(payerDetails, splitDetails, totalAmount)
      ) {
        throw new Error("Transaction amount is not correct");
      }
      const groupTransaction =
        await this.groupTransactionModel.createGroupTransaction({
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
        await this.groupTransactionModel.getGroupTransactionsByGroupId(
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
}

module.exports = TransactionControllers;
