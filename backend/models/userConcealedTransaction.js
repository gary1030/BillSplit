const { prisma } = require("../prisma");

/*
model UserConcealedTransaction {
  id                 String           @id @default(auto()) @map("_id") @db.ObjectId
  user               User             @relation(fields: [userId], references: [id])
  userId             String           @db.ObjectId
  groupTransaction   GroupTransaction @relation(fields: [groupTransactionId], references: [id])
  groupTransactionId String           @db.ObjectId
}
*/

class UserConcealedTransaction {
  async createUserConcealedTransaction(userId, groupTransactionId) {
    const userConcealedTransaction =
      await prisma.userConcealedTransaction.create({
        data: {
          user: { connect: { id: userId } },
          groupTransaction: { connect: { id: groupTransactionId } },
        },
      });
    return userConcealedTransaction;
  }

  async getUserConcealedTransactionByUserId(userId, startTime, endTime) {
    const userConcealedTransaction =
      await prisma.userConcealedTransaction.findMany({
        where: {
          userId: userId,
          groupTransaction: {
            createdAt: {
              gte: new Date(startTime),
              lte: new Date(endTime),
            },
          },
        },
      });
    return userConcealedTransaction;
  }
}

module.exports = new UserConcealedTransaction();
