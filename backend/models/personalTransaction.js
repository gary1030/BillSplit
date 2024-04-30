const { prisma } = require("../prisma");
const { getEndOfDate } = require("../utils/getEndOfDate");

/*
model PersonalTransaction {
  id         String                  @id @default(auto()) @map("_id") @db.ObjectId
  user       User                    @relation(fields: [userId], references: [id])
  userId     String                  @db.ObjectId
  category   Category                @relation(fields: [categoryId], references: [id])
  categoryId String                  @db.ObjectId
  currency   Currency                @relation(fields: [currencyId], references: [id])
  currencyId String                  @db.ObjectId
  type       PersonalTransactionType @default(EXPENSE)
  title      String
  amount     Float
  createdAt  DateTime                @default(now())
  updatedAt  DateTime                @default(now())
}
*/

class PersonalTransaction {
  async createPersonalTransaction(
    userId,
    categoryId,
    currencyId,
    type,
    title,
    amount
  ) {
    const personalTransaction = await prisma.personalTransaction.create({
      data: {
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        currency: { connect: { id: currencyId } },
        type: type,
        title: title,
        amount: amount,
      },
    });
    return personalTransaction;
  }

  async getPersonalTransactionByUserId(userId, startTime, endTime) {
    const personalTransaction = await prisma.personalTransaction.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(startTime),
          lte: getEndOfDate(endTime),
        },
      },
    });
    return personalTransaction;
  }
}

module.exports = new PersonalTransaction();
