const { validate, ValidationError, Joi } = require('express-validation')

const validation = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json(err)
	}

	return next(err);
}

module.exports =
{
    validation,
}