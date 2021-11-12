const express = require('express');

const userRouter = express.Router();

const multer = require('multer');
const { validate } = require('express-validation');
const userHandler = require('../handlers/user');
const userValidation = require('../validation/user');
const { authorization, isAdmin } = require('../middleware/auth');
const { validateRegisterErr, validateLoginErr } = require('../middleware/error')

const upload = multer({ dest: 'uploads/' });

userRouter.get('/', userHandler.home);

userRouter.post('/login', validate(userValidation.login, {}, {}), validateLoginErr, userHandler.login);

userRouter.get('/login', userHandler.getLogin);

userRouter.get('/register', userHandler.getRegister);

userRouter.get('/profile', userHandler.getProfile);

userRouter.get('/api/user/images/:key', authorization, userHandler.getImage);

userRouter.get('/edit/:username', authorization, userHandler.getEdit);

userRouter.post('/register', upload.single('avatar'), validate(userValidation.register, {}, {}), validateRegisterErr, userHandler.register);

userRouter.get('/api/user/profile/:username', authorization, userHandler.profile);

userRouter.post('/api/user/update/:username', authorization, upload.single('avatar'), validate(userValidation.update, {}, {}), userHandler.update);

userRouter.get('/api/user/logout', authorization, userHandler.logout);

userRouter.get('/api/user/delete/:username', authorization, isAdmin, userHandler.deleteUser);

userRouter.get('/users', authorization, isAdmin, userHandler.getUserList);

module.exports = userRouter;
