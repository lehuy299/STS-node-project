const express = require('express');
const userRouter = express.Router();
const userHandler = require('../handlers/user.js')
const userValidation = require('../validation/user.js')
const { validate, ValidationError, Joi } = require('express-validation')
const authorization = require("../middleware/auth.js")

userRouter.post('/api/user/login', validate(userValidation.login, {}, {}), userHandler.login)

userRouter.get('/login', userHandler.getLogin)

userRouter.get('/register', userHandler.getRegister)

userRouter.get('/profile', userHandler.getProfile)

userRouter.get('/edit/:username', authorization, userHandler.getEdit)

userRouter.post('/api/user/register', validate(userValidation.register, {}, {}), userHandler.register)

userRouter.get('/api/user/profile/:username', authorization, userHandler.profile)

userRouter.post('/api/user/update/:username', authorization, userHandler.update)

userRouter.get('/api/user/logout', authorization, userHandler.logout)

module.exports = userRouter;