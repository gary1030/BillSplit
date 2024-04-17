const { User } = require("../models");

class LoginControllers {
  async login(googleToken) {
    const googleUser = await this.getInfoFromGoogle(googleToken);

    const userModel = new User();
    const user = await userModel.getUserByGoogleId(googleUser.id);

    if (!user) {
      const newUser = await userModel.createUser(
        googleUser.username,
        googleUser.email,
        googleUser.id
      );
      return newUser;
    }

    return user;
  }

  // TODO: implement google oauth
  async getInfoFromGoogle(googleToken) {
    return {
      email: "kk@gmail.com",
      username: "kk",
      id: "degegege",
    };
  }
}

module.exports = LoginControllers;
