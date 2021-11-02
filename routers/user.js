const express = require('express');
const userRouter = express.Router();
const userHandler = require('../handlers/user.js')

userRouter.post('/login', userHandler.login)

userRouter.post('/register', userHandler.register)

module.exports = userRouter;