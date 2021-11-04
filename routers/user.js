const express = require('express');
const userRouter = express.Router();
const userHandler = require('../handlers/user.js')
const userValidation = require('../validation/user.js')
const { validate, ValidationError, Joi } = require('express-validation');
const authorization = require("../middleware/auth.js")

userRouter.post('/login',validate(userValidation.login, {}, {}), userHandler.login)

userRouter.post('/register', validate(userValidation.register, {}, {}), userHandler.register)

userRouter.get('/welcome', authorization, userHandler.welcome)

userRouter.get('/logout', authorization, userHandler.logout)

module.exports = userRouter;