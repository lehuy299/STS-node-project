const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		avatar: [
			{
				path: String,
				filename: String
			}
		],
		email: String,
		firstName: String,
		lastName: String,
		dateOfBirth: String
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model