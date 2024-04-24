const { prisma } = require("../prisma");

class Group {
  async createGroup(name, userId) {
    const group = await prisma.group.create({
      data: {
        name,
        owner: {
          connect: {
            id: userId,
          },
        },
        members: {
          connect: [
            {
              id: userId,
            },
          ],
        },
      },
    });
    return group;
  }

  async getGroupById(groupId) {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });
    return group;
  }

  async getGroupsByUserId(userId) {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });
    return groups;
  }
}

module.exports = new Group();
