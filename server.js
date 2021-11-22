const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const userRouter = require('./routers/user.js');
const chatRouter = require('./routers/chat.js');
const app = express()
const mongoConnectionString = process.env.MONGO_DB_CONNECTION_STRING || 'mongodb://localhost:27017/login-app-db';
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const cookieParser = require("cookie-parser");
const errorHandler = require('./handlers/error.js')
const session = require('express-session');
const flash = require('express-flash');
const http = require('http');
const server = http.createServer(app);
const { chatHandler } = require('./socket/chat');

mongoose
	.connect(mongoConnectionString, {})
	.then(() => console.log("Successfully connected to database"))
	.catch(err => {
		errorHandler.databaseConnectionFailed(err);
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());

app.use(session({ secret: 'blablablablabla', resave: false, saveUninitialized: false }));
app.use(flash());

app.use('/', userRouter);

chatHandler(server);

app.use('/', chatRouter);

server.listen(port, () => {
	console.log(`Server up at ${port}`)
})