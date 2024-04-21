const Currency = require("../models/currency");

class CurrencyControllers {
  constructor() {
    this.currencyModel = new Currency();
  }

  async getAllCurrencies() {
    try {
      const currencies = await this.currencyModel.getAllCurrencies();
      return { data: currencies };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = CurrencyControllers;
