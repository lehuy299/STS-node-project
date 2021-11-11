const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const userRouter = require('./routers/user.js');
const app = express()
const mongoConnectionString = process.env.MONGO_DB_CONNECTION_STRING || 'mongodb://localhost:27017/login-app-db';
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const cookieParser = require("cookie-parser");
const errorHandler = require('./handlers/error.js')
const session = require('express-session');
const flash = require('express-flash');

mongoose
	.connect(mongoConnectionString, {})
	.then(() => console.log("Successfully connected to database"))
	.catch(err => {
		errorHandler.databaseConnectionFailed(err);
	})

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());

app.use(session( {secret:'blablablablabla', resave: false, saveUninitialized: false} ));
app.use(flash());

app.use('/', userRouter);

app.use(require('./middleware/error.js').validation);

app.listen(port, () => {
	console.log(`Server up at ${port}`)
})