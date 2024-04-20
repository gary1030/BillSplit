const User = require("../models/user");

class UserControllers {
  constructor() {
    this.userModel = new User();
  }

  async getUserById(userId) {
    try {
      const user = await this.userModel.getUserById(userId);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserGroups(userId) {
    try {
      const groups = await this.userModel.getUserGroups(userId);

      return { groups: groups };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserControllers;
