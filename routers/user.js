const express = require('express');
const userRouter = express.Router();
const userHandler = require('../handlers/user.js')
const userValidation = require('../validation/user.js')
const { validate, ValidationError, Joi } = require('express-validation');

userRouter.post('/login',validate(userValidation.login, {}, {}), userHandler.login)

userRouter.post('/register', validate(userValidation.register, {}, {}), userHandler.register)

module.exports = userRouter;