const { prisma } = require("../prisma");

/*
model GroupRepayment {
    id         String
    groupId    String
    currencyId String
    payerId    String
    receiverId String
    amount     Float
  }
*/

class GroupRepayment {
  async createGroupRepayment(data) {
    const groupRepayment = await prisma.groupRepayment.create({
      data: {
        groupId: data.groupId,
        currencyId: data.currencyId,
        payerId: data.payerId,
        receiverId: data.receiverId,
        amount: data.amount,
      },
    });

    return groupRepayment;
  }

  async getGroupRepaymentById(id) {
    const groupRepayment = await prisma.groupRepayment.findUnique({
      where: {
        id,
      },
    });

    return groupRepayment;
  }

  async updateGroupRepaymentById(id, data) {
    const groupRepayment = await prisma.groupRepayment.update({
      where: {
        id,
      },
      data,
    });

    return groupRepayment;
  }

  async deleteGroupRepaymentById(id) {
    const groupRepayment = await prisma.groupRepayment.delete({
      where: {
        id,
      },
    });

    return groupRepayment;
  }

  async getGroupRepaymentsByGroupId(groupId) {
    const groupRepayments = await prisma.groupRepayment.findMany({
      where: {
        groupId,
      },
    });

    return groupRepayments;
  }
}

module.exports = new GroupRepayment();
