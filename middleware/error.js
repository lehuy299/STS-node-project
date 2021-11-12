
const { ValidationError } = require('express-validation')

const validateRegisterErr = (err, req, res, next) => {
	const user = req.body;
	if (err instanceof ValidationError) {
		req.flash('validateErr', err.details.body[0].message)
		return res.render('pages/register', { user });
	}
	return next(err);
}

const validateLoginErr = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		req.flash('validateErr', err.details.body[0].message)
		return res.render('pages/login');
	}
	return next(err);
}

module.exports =
{
	validateRegisterErr,
	validateLoginErr
}