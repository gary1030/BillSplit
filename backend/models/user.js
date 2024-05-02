const { prisma } = require("../prisma");

class User {
  async createUser(username, email, googleUserId) {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        googleUserId,
      },
    });
    return user;
  }

  async getUserByGoogleId(googleUserId) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          googleUserId: googleUserId,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return user;
  }

  async getUsersInBatch(ids) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return users;
  }

  async getUserGroups(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        groups: {
          select: {
            id: true,
            name: true,
            theme: true,
          },
        },
      },
    });
    if (!user) {
      return [];
    }
    return user.groups;
  }
}

module.exports = new User();
