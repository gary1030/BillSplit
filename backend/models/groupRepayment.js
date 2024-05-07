const { prisma } = require("../prisma");

/*
model GroupRepayment {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  group      Group    @relation(fields: [groupId], references: [id])
  groupId    String   @db.ObjectId
  currency   Currency @relation(fields: [currencyId], references: [id])
  currencyId String   @db.ObjectId
  payerId    String   @db.ObjectId
  payer      User     @relation("payer", fields: [payerId], references: [id])
  receiverId String   @db.ObjectId
  receiver   User     @relation("receiver", fields: [receiverId], references: [id])
  amount     Float
}
*/

class GroupRepayment {
  async createGroupRepayment(groupId, currencyId, payerId, receiverId, amount) {
    const groupRepayment = await prisma.groupRepayment.create({
      data: {
        group: { connect: { id: groupId } },
        currency: { connect: { id: currencyId } },
        payer: { connect: { id: payerId } },
        receiver: { connect: { id: receiverId } },
        amount: amount,
      },
    });

    return groupRepayment;
  }

  async getGroupRepaymentById(id) {
    const groupRepayment = await prisma.groupRepayment.findUnique({
      where: { id: id },
    });
    return groupRepayment;
  }

  async updateGroupRepaymentById(
    id,
    groupId,
    currencyId,
    payerId,
    receiverId,
    amount
  ) {
    const groupRepayment = await prisma.groupRepayment.update({
      where: {
        id: id,
      },
      data: {
        group: { connect: { id: groupId } },
        currency: { connect: { id: currencyId } },
        payer: { connect: { id: payerId } },
        receiver: { connect: { id: receiverId } },
        amount: amount,
      },
    });

    return groupRepayment;
  }

  async deleteGroupRepaymentById(id) {
    const groupRepayment = await prisma.groupRepayment.delete({
      where: { id },
    });

    return groupRepayment;
  }

  async getGroupRepaymentsByGroupId(groupId) {
    const groupRepayments = await prisma.groupRepayment.findMany({
      where: { groupId: groupId },
    });

    return groupRepayments;
  }
}

module.exports = new GroupRepayment();
