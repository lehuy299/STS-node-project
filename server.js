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
const { Server } = require("socket.io");
const Message = require('./model/message.js');
const User = require('./model/user.js');
const io = new Server(server);
const jwt = require('jsonwebtoken');
const Chatroom = require('./model/chatroom.js');
const { instrument } = require('@socket.io/admin-ui');

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

app.use(session({ secret: 'blablablablabla', resave: false, saveUninitialized: false }));
app.use(flash());

app.use('/', userRouter);

io.use(async (socket, next) => {
	try {
		const token = socket.handshake.query.token;
		const data = await jwt.verify(token, process.env.JWT_SECRET);
		socket.username = data.username;
		next();
		// eslint-disable-next-line no-empty
	} catch (err) { }
});

io.on('connection', async (socket) => {
	console.log('A user connected: ' + socket.username);

	socket.on('disconnect', () => {
		console.log('A user disconnected: ' + socket.username);
	});

	socket.on("join-room", async (room, curUser, cb) => {
		const joinedRoom = await Chatroom.findOne({ name: room });
		let roomId;
		if (!joinedRoom) {
			const newRoom = await new Chatroom({ name: room });
			roomId = newRoom._id;
			await newRoom.save();

			socket.join(newRoom.name);
			cb(`Joined ${newRoom.name}`)
		} else {
			roomId = joinedRoom._id;
			socket.join(room);
			cb(`Joined ${room}`);
		}
		await Message.updateMany({ user: { $ne: socket.username }, chatroom: roomId }, { $addToSet: { seenList: [curUser] } });
		const message = await Message.find({ chatroom: roomId });
		//console.log("222", message.seenList);
		io.to(room).emit('seen-message', { message });
	});

	socket.on('chat message', async (msg, room) => {
		const user = await User.findOne({ username: socket.username });
		const roomId = (await Chatroom.findOne({ name: room }))._id;
		const newMessage = await new Message({ user: user.username, message: msg, chatroom: roomId });
		io.to(room).emit('chat message', { message: msg, username: user.username, id: newMessage._id });
		await newMessage.save();
	});

	socket.on('edit-message', async (msgId, newMsg, room) => {
		//update the message and return it to client
		await Message.updateOne({ _id: msgId }, { message: newMsg });
		const message = await Message.find({ _id: msgId });
		io.to(room).emit('edit-message', { message });
	});
});

app.use('/', chatRouter);

server.listen(port, () => {
	console.log(`Server up at ${port}`)
})