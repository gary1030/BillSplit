// src/db/index.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function connect() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

async function disconnect() {
  await prisma.$disconnect();
  console.log("Disconnected from the database");
}

module.exports = {
  connect,
  disconnect,
  prisma,
};
