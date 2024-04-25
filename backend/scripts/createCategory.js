const prisma = require("../prisma");
const Category = require("../models/category");

async function main() {
  try {
    await prisma.connect();
    console.log("Connected to the database");

    const categoryList = [
      {
        name: "Food",
      },
      {
        name: "Transportation",
      },
      {
        name: "Entertainment",
      },
      {
        name: "Shopping",
      },
      {
        name: "Health",
      },
      {
        name: "Education",
      },
      {
        name: "Life",
      },
      {
        name: "Investment",
      },
      {
        name: "Others",
      },
    ];

    for (const category of categoryList) {
      try {
        await Category.createCategory(category.name);
        console.log(`Category ${category.name} created`);
      } catch (error) {
        console.error(`Error creating category ${category.name}:`, error);
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
