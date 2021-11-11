const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.sendStatus(403);
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      
      return next();
    } catch(e) {
      console.log(e);
      return res.sendStatus(403);
    }
};

module.exports = authorization;