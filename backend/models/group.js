const { prisma } = require("../prisma");

/*
model Group {
  id             String             @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  theme          String
  createdAt      DateTime           @default(now())
  members        User[]             @relation(fields: [memberIds], references: [id], name: "members")
  memberIds      String[]           @db.ObjectId
  owner          User               @relation(fields: [ownerId], references: [id], name: "owner")
  ownerId        String             @db.ObjectId
}
*/

class Group {
  async createGroup(name, userId, theme) {
    const group = await prisma.group.create({
      data: {
        name,
        theme,
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
        memberIds: {
          has: userId,
        },
      },
    });
    return groups;
  }

  async addGroupMember(groupId, memberId) {
    const updatedGroup = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: [{ id: memberId }],
        },
      },
    });
    return updatedGroup;
  }

  async deleteGroupMember(groupId, memberId) {
    const updatedGroup = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          disconnect: [{ id: memberId }],
        },
      },
    });
    return updatedGroup;
  }
  async editGroup(groupId, name, theme) {
    const updatedGroup = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
        theme,
      },
    });
    return updatedGroup;
  }
}

module.exports = new Group();
