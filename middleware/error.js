const { ValidationError } = require('express-validation')

const validation = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		req.flash('validateErr', err.details.body[0].message)
		return res.redirect('back');
	}

	return next(err);
}

module.exports =
{
	validation
}