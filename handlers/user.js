const User = require('../model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { uploadFile, getFileStream } = require('../s3/s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

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

exports.getImage = (req, res) => {
	console.log(req.params)
	const key = req.params.key
	const readStream = getFileStream(key)

	readStream.pipe(res)
}

exports.login = async (req, res) => {

	const { username, password } = req.body

	const user = await User.findOne({ username }).lean()

	if (!user) {
		req.flash('invalidUserErr', "Invalid username/password");
		return res.redirect('/login');
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

	req.flash('invalidUserErr', "Invalid username/password");
	return res.redirect('/login');
};

exports.register = async (req, res) => {
	const { username, password: plainTextPassword, email, firstName, lastName, dateOfBirth } = req.body

	const password = await bcrypt.hash(plainTextPassword, 10)

	const isDuplicated = await User.findOne({ username: username })

	if (isDuplicated) {
		req.flash('userDupErr', "Username has been created");
		return res.redirect('/register');
	}

	const file = req.file

	const result = await uploadFile(file)
	await unlinkFile(file.path)

	const avatarUrl = result.Key

	const response = await User.create({
		username,
		password,
		avatarUrl,
		email,
		firstName,
		lastName,
		dateOfBirth
	})
	console.log('User created successfully: ', response)
	req.flash('signupSucessMsg', "Register successfully. Now please login");
	res.redirect('/login');
}

exports.update = async (req, res) => {
	const { email, firstName, lastName, dateOfBirth } = req.body;
	const username = req.params.username;
	const user = await User.findOne({ username: username }).lean();
	let avatarUrl = user.avatarUrl;

	if (req.file) {
		const file = req.file

		const result = await uploadFile(file)
		await unlinkFile(file.path)

		avatarUrl = result.Key
	}

	try {
		const response = await User.updateOne(
			{ username: username },
			{
				$set: {
					email: email,
					avatarUrl: avatarUrl,
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
	req.flash('logoutMsg', "Successfully Logged Out");
	return res
		.clearCookie("token")
		.status(200)
		.redirect('/')
};

