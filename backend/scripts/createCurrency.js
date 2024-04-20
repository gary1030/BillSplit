const prisma = require("../prisma");
const Currency = require("../models/currency");

async function main() {
  try {
    await prisma.connect();
    console.log("Connected to the database");

    const currencyList = [
      {
        name: "TWD",
        value: 1,
      },
      {
        name: "USD",
        value: 32.2,
      },
      {
        name: "JPY",
        value: 0.22,
      },
    ];

    const currencyModel = new Currency();
    for (const currency of currencyList) {
      try {
        await currencyModel.createCurrency(currency.name, currency.value);
        console.log(`Currency ${currency.name} created`);
      } catch (error) {
        console.error(`Error creating currency ${currency.name}:`, error);
      }
    }

    await prisma.disconnect();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

main();
