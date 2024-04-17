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
    const user = await prisma.user.findUnique({
      where: {
        googleUserId: googleUserId,
      },
    });
    return user;
  }
}

module.exports = User;
