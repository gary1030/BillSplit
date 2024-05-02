const User = require("../models/user");

class UserControllers {
  async getUserById(userId) {
    try {
      const user = await User.getUserById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsersInBatch(ids) {
    try {
      const users = await User.getUsersInBatch(ids);
      return { users };
    } catch (error) {
      throw error;
    }
  }

  async getUserGroups(userId) {
    try {
      const groups = await User.getUserGroups(userId);

      return { data: groups };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new UserControllers();
