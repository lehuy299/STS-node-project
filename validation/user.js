const { validate, ValidationError, Joi } = require('express-validation');

const login = {
    body: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
    }),
};

const register = {
    body: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
    }),
}

module.exports =    
{  
    login,
    register
};