const User = require('../model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const errorHandler = require('./error.js');

exports.getRegister = (req, res) => {
	res.render('pages/register');
}

exports.getLogin = (req, res) => {
	res.render('pages/login');
}

exports.getProfile = (req, res) => {
	res.render('pages/profile');
}

exports.getEdit = async (req, res) => {
	const username = req.params.username;
	const user = await User.findOne({ username: username }).lean();



	res.render('pages/edit', { user: user });
}

exports.login = async (req, res) => {

	const { username, password } = req.body

	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res
			.cookie("token", token, {
				httpOnly: true,
				//secure: process.env.NODE_ENV === "production",
			})
			.redirect('/api/user/profile/' + username)
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
};

exports.register = async (req, res) => {
	const { username, password: plainTextPassword, email, firstName, lastName, dateOfBirth } = req.body

	const password = await bcrypt.hash(plainTextPassword, 10)

	const isDuplicated = await User.findOne({ username: username })

	if (isDuplicated) return res.render('pages/register', { error: "Username has been created" })

	const response = await User.create({
		username,
		password,
		email,
		firstName,
		lastName,
		dateOfBirth
	})
	console.log('User created successfully: ', response)

	res.redirect('/login');
}

exports.update = async (req, res) => {
	const { firstName, lastName, dateOfBirth } = req.body;
	const username = req.params.username;

	try {
		const response = await User.updateOne(
			{ username: username },
			{
				$set: {
					firstName: firstName,
					lastName: lastName,
					dateOfBirth: dateOfBirth
				}
			}
		)
		console.log('User update successfully: ', response)
	} catch (error) {
		console.log(error);
	}
	res.redirect('/api/user/profile/' + username);
}

exports.profile = async (req, res) => {
	const username = req.params.username;
	const user = await User.findOne({ username: username }).lean();

	res.render('pages/profile', { user: user });
};

exports.logout = (req, res) => {
	return res
		.clearCookie("token")
		.status(200)
		.json({ message: "Successfully logged out 😏 🍀" })
};

