var jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authentication = (req, res, next) => {
  let token;
  try {
    token = req.headers['authorization'].split(' ')[1];
  } catch (e) {
    token = '';
  }

  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = authentication;