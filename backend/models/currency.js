const { prisma } = require("../prisma");

class Currency {
  async createCurrency(name, value) {
    const currency = await prisma.currency.create({
      data: {
        name,
        value,
      },
    });
    return currency;
  }

  async getCurrencyById(currencyId) {
    const currency = await prisma.currency.findUnique({
      where: {
        id: currencyId,
      },
    });
    return currency;
  }

  async getAllCurrencies() {
    const currencies = await prisma.currency.findMany();
    return currencies;
  }

  async getDefaultCurrencyId() {
    const currencyName = "TWD";
    const currency = await prisma.currency.findFirst({
      where: {
        name: currencyName,
      },
    });
    return currency.id;
  }
}

module.exports = Currency;
