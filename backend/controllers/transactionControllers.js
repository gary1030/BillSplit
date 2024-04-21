const PersonalTransaction = require("../models/personalTransaction");
const Currency = require("../models/currency");

class TransactionControllers {
  constructor() {
    this.personalTransactionModel = new PersonalTransaction();
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
}

module.exports = TransactionControllers;
