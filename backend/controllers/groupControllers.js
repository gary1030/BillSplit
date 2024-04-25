const group = require("../models/group");
const Group = require("../models/group");

class GroupControllers {
  async createGroup(name, userId) {
    try {
      const group = await Group.createGroup(name, userId);
      return group;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getGroupById(groupId, userId) {
    try {
      const group = await Group.getGroupById(groupId);
      if (!group) {
        return null;
      }

      // check if user is a member of the group
      const isMember = group.memberIds.some((memberId) => memberId === userId);
      if (!isMember) {
        throw new Error("Unauthorized!");
      }
      return group;
    } catch (error) {
      throw error;
    }
  }

  async isUserInGroup(groupId, userId) {
    try {
      const group = await Group.getGroupById(groupId);
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

  async addGroupMember(groupId, userId) {
    try {
      const updatedGroup = await Group.addGroupMember(groupId, userId);
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }

  async deleteGroupMember(groupId, userId) {
    try {
      const updatedGroup = await Group.deleteGroupMember(groupId, userId);
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GroupControllers();
