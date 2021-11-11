const User = require('../model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

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

exports.home = (req, res) => {
	res.render('pages/home');
}

exports.login = async (req, res) => {

	const { username, password } = req.body

	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {

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

	const { path, filename } = req.file || {};

	const response = await User.create({
		username,
		password,
		avatar: { path: path, filename: filename },
		email,
		firstName,
		lastName,
		dateOfBirth
	})
	console.log('User created successfully: ', response)

	res.redirect('/login');
}

exports.update = async (req, res) => {
	const { email, firstName, lastName, dateOfBirth } = req.body;
	const username = req.params.username;
	const { path, filename } = req.file || {};

	try {
		const response = await User.updateOne(
			{ username: username },
			{
				$set: {
					email: email,
					avatar: { path: path, filename: filename },
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

	if (username !== req.username) return res.send(403)

	const user = await User.findOne({ username: username }).lean();

	res.render('pages/profile', { user: user });
};

exports.logout = (req, res) => {
	return res
		.clearCookie("token")
		.status(200)
		.redirect('/')
};

