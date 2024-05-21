const User = require("../models/user");
const axios = require("axios");
const { JWT_SECRET, JWT_EXPIRATION } = require("../config");
var jwt = require("jsonwebtoken");

class LoginControllers {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirect_uri =
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000";
    this.login = this.login.bind(this);
  }
  async login(req, res) {
    const code = req.body.code;

    try {
      const googleToken = await this.getTokenFromGoogle(code);
      if (!googleToken) {
        throw new Error("Unauthorized user");
      }

      const googleUser = await this.getProfileFromGoogle(googleToken);

      let user = await User.getUserByGoogleId(googleUser.id);

      if (!user) {
        user = await User.createUser(
          googleUser.name,
          googleUser.email,
          googleUser.id
        );
      }

      user.token = this.generateJWTToken(user.id);
      res.send(user);
    } catch (error) {
      console.log("Unauthorized client: ", error);
      res.status(401).json({ message: "Unauthorized!" });
    }
  }

  async getTokenFromGoogle(code) {
    try {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirect_uri,
        grant_type: "authorization_code",
      });

      const { access_token } = response.data;
      return access_token;
    } catch (error) {
      console.log("Error from Google:", error.response.data);
      return null;
    }
  }

  async getProfileFromGoogle(token) {
    try {
      const userResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userDetails = userResponse.data;
      return {
        id: userDetails.sub,
        email: userDetails.email,
        name: userDetails.name,
      };
    } catch (error) {
      console.log("Error getting user details:", error);
      return null;
    }
  }

  generateJWTToken(userId) {
    return jwt.sign({ userId: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
  }
}

module.exports = new LoginControllers();
