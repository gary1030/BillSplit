const { prisma } = require("../prisma");
const { getEndOfDate } = require("../utils/getEndOfDate");

/*
model GroupTransaction {
  id                       String                     @id @default(auto()) @map("_id") @db.ObjectId
  group                    Group                      @relation(fields: [groupId], references: [id])
  groupId                  String                     @db.ObjectId
  category                 Category                   @relation(fields: [categoryId], references: [id])
  categoryId               String                     @db.ObjectId
  currency                 Currency                   @relation(fields: [currencyId], references: [id])
  currencyId               String                     @db.ObjectId
  title                    String
  note                     String?
  totalAmount              Float
  payerDetails             PayerDetail[]
  splitDetails             SplitDetail[]
  consumptionDate          DateTime                   @default(now())
  createdAt                DateTime                   @default(now())
  updatedAt                DateTime                   @default(now())
  UserConcealedTransaction UserConcealedTransaction[]
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
        group: { connect: { id: data.groupId } },
        category: { connect: { id: data.categoryId } },
        currency: { connect: { id: data.currencyId } },
        title: data.title,
        totalAmount: data.totalAmount,
        payerDetails: data.payerDetails,
        splitDetails: data.splitDetails,
        note: data?.note || "",
        consumptionDate: data.consumptionDate,
      },
    });

    return groupTransaction;
  }

  async getGroupTransactionById(id) {
    const groupTransaction = await prisma.groupTransaction.findUnique({
      where: { id: id },
    });

    return groupTransaction;
  }

  async updateGroupTransactionById(
    id,
    groupId,
    categoryId,
    currencyId,
    title,
    totalAmount,
    payerDetails,
    splitDetails,
    note,
    consumptionDate
  ) {
    const groupTransaction = await prisma.groupTransaction.update({
      where: {
        id,
      },
      data: {
        group: { connect: { id: groupId } },
        category: { connect: { id: categoryId } },
        currency: { connect: { id: currencyId } },
        title: title,
        totalAmount: totalAmount,
        payerDetails: payerDetails,
        splitDetails: splitDetails,
        note: note,
        consumptionDate: consumptionDate,
      },
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

  async getGroupTransactionsByGroupId(
    groupId,
    startTime = null,
    endTime = null
  ) {
    if (startTime && endTime) {
      const groupTransactions = await prisma.groupTransaction.findMany({
        where: {
          groupId: groupId,
          consumptionDate: {
            gte: new Date(startTime),
            lte: getEndOfDate(endTime),
          },
        },
      });

      return groupTransactions;
    } else {
      const groupTransactions = await prisma.groupTransaction.findMany({
        where: {
          groupId: groupId,
        },
      });

      return groupTransactions;
    }
  }
}

module.exports = new GroupTransaction();
