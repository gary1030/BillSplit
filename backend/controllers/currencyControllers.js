const Currency = require("../models/currency");

class CurrencyControllers {
  async getAllCurrencies() {
    try {
      const currencies = await Currency.getAllCurrencies();
      return { data: currencies };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new CurrencyControllers();
