const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const userRouter = require('./routers/user.js');
const app = express()
const mongoConnectionString = process.env.MONGO_DB_CONNECTION_STRING || 'mongodb://localhost:27017/login-app-db';
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

mongoose
	.connect(mongoConnectionString, {})
	.then(() => console.log("Successfully connected to database"))
	.catch(err => {
		console.log("database connection failed. exiting now...");
		console.error(err);
		process.exit(1);
	})

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.use('/api', userRouter);

app.listen(port, () => {
	console.log(`Server up at ${port}`)
})