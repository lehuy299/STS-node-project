const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authorization = (req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.role = data.role;
    req.id = data.id;
    req.username = data.username;

    return next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }

};

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.id);
  if (user.role === 'admin') return next();
  return res.sendStatus(403);
};

module.exports = {
  authorization,
  isAdmin,
};
