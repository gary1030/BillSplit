const Group = require("../models/group");

class GroupControllers {
  constructor() {
    this.groupModel = new Group();
  }
  async createGroup(name, userId) {
    try {
      const group = await this.groupModel.createGroup(name, userId);
      return group;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getGroupById(groupId, userId) {
    try {
      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        return null;
      }

      // check if user is a member of the group
      const isMember = group.memberIds.some((memberId) => memberId === userId);
      if (!isMember) {
        return null;
      }
      return group;
    } catch (error) {
      throw new Error("Unauthorized!");
    }
  }

  async isUserInGroup(groupId, userId) {
    try {
      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        return false;
      }

      // check if user is a member of the group
      const isMember = group.memberIds.some((memberId) => memberId === userId);
      return isMember;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = GroupControllers;
