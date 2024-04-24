const { prisma } = require("../prisma");

/*
model GroupTransaction {
  id                       String                     @id @default(auto()) @map("_id") @db.ObjectId
  groupId                  String                     @db.ObjectId
  categoryId               String                     @db.ObjectId
  currencyId               String                     @db.ObjectId
  title                    String
  totalAmount              Float
  payerDetails             PayerDetail[]
  splitDetails             SplitDetail[]
  createdAt                DateTime                   @default(now())
  updatedAt                DateTime                   @default(now())
}

type PayerDetail {
  payerId String @db.ObjectId
  amount  Float
}

type SplitDetail {
  sharerId String @db.ObjectId
  amount   Float
}
*/

class GroupTransaction {
  async createGroupTransaction(data) {
    const groupTransaction = await prisma.groupTransaction.create({
      data: {
        groupId: data.groupId,
        categoryId: data.categoryId,
        currencyId: data.currencyId,
        title: data.title,
        totalAmount: data.totalAmount,
        payerDetails: data.payerDetails,
        splitDetails: data.splitDetails,
      },
    });

    return groupTransaction;
  }

  async getGroupTransactionById(id) {
    const groupTransaction = await prisma.groupTransaction.findUnique({
      where: {
        id,
      },
    });

    return groupTransaction;
  }

  async updateGroupTransactionById(id, data) {
    const groupTransaction = await prisma.groupTransaction.update({
      where: {
        id,
      },
      data,
    });

    return groupTransaction;
  }

  async deleteGroupTransactionById(id) {
    const groupTransaction = await prisma.groupTransaction.delete({
      where: {
        id,
      },
    });

    return groupTransaction;
  }

  async getGroupTransactionsByGroupId(groupId) {
    const groupTransactions = await prisma.groupTransaction.findMany({
      where: {
        groupId,
      },
    });

    return groupTransactions;
  }
}

module.exports = new GroupTransaction();
