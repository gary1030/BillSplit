const { prisma } = require("../prisma");
const { getEndOfDate } = require("../utils/getEndOfDate");

/*
model PersonalTransaction {
  id              String                  @id @default(auto()) @map("_id") @db.ObjectId
  user            User                    @relation(fields: [userId], references: [id])
  userId          String                  @db.ObjectId
  category        Category                @relation(fields: [categoryId], references: [id])
  categoryId      String                  @db.ObjectId
  currency        Currency                @relation(fields: [currencyId], references: [id])
  currencyId      String                  @db.ObjectId
  type            PersonalTransactionType @default(EXPENSE)
  title           String
  note            String?
  amount          Float
  consumptionDate DateTime                @default(now())
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @default(now())
}
*/

class PersonalTransaction {
  async createPersonalTransaction(
    userId,
    categoryId,
    currencyId,
    type,
    title,
    amount,
    consumptionDate
  ) {
    const personalTransaction = await prisma.personalTransaction.create({
      data: {
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        currency: { connect: { id: currencyId } },
        type: type,
        title: title,
        amount: amount,
        consumptionDate: consumptionDate,
      },
    });
    return personalTransaction;
  }

  async getPersonalTransactionByUserId(
    userId,
    startTime = null,
    endTime = null
  ) {
    if (startTime && endTime) {
      const personalTransactions = await prisma.personalTransaction.findMany({
        where: {
          userId: userId,
          consumptionDate: {
            gte: new Date(startTime),
            lte: getEndOfDate(endTime),
          },
        },
      });
      return personalTransactions;
    } else {
      const personalTransactions = await prisma.personalTransaction.findMany({
        where: {
          userId: userId,
        },
      });
      return personalTransactions;
    }
  }

  async getPersonalTransactionById(id) {
    const personalTransaction = await prisma.personalTransaction.findUnique({
      where: {
        id: id,
      },
    });
    return personalTransaction;
  }

  async updatePersonalTransactionById(
    id,
    userId,
    categoryId,
    currencyId,
    type,
    title,
    amount,
    consumptionDate
  ) {
    const personalTransaction = await prisma.personalTransaction.update({
      where: {
        id: id,
      },
      data: {
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        currency: { connect: { id: currencyId } },
        type: type,
        title: title,
        amount: amount,
        consumptionDate: consumptionDate,
      },
    });
    return personalTransaction;
  }

  async deletePersonalTransactionById(id) {
    const personalTransaction = await prisma.personalTransaction.delete({
      where: {
        id: id,
      },
    });
    return personalTransaction;
  }
}

module.exports = new PersonalTransaction();
