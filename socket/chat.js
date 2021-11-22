
const dotenv = require('dotenv')
dotenv.config()
const Message = require('../model/message.js');
const User = require('../model/user.js');
let io;
const Chatroom = require('../model/chatroom.js');
const jwt = require('jsonwebtoken');

exports.chatHandler = (server) => {
    io = require('socket.io')(server);

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

        socket.on("join-room", async (roomId, curUser) => {
            //const joinedRoom = await Chatroom.findOne({ _id: roomId });
            //let roomId;
            // if (!joinedRoom) {
            //     const newRoom = await new Chatroom({ name: room });
            //     roomId = newRoom._id;
            //     await newRoom.save();

            //     socket.join(newRoom.name);
            // } else {
            //     roomId = joinedRoom._id;
            //}
            socket.join(roomId);
            
            await Message.updateMany({ user: { $ne: socket.username }, chatroom: roomId }, { $addToSet: { seenList: [curUser] } });
            const message = await Message.find({ chatroom: roomId });
            //console.log("222", message.seenList);
            io.to(roomId).emit('seen-message', { message });
        });

        socket.on('chat message', async (msg, roomId, timeNow) => {
            const user = await User.findOne({ username: socket.username });
            //const roomId = (await Chatroom.findOne({ name: room }))._id;
            const newMessage = await new Message({ user: user.username, message: msg, chatroom: roomId, sentTime: timeNow });
            io.to(roomId).emit('chat message', { message: msg, username: user.username, id: newMessage._id, sentTime: timeNow });
            await newMessage.save();
        });

        socket.on('edit-message', async (msgId, newMsg, roomId) => {
            //update the message and return it to client
            await Message.updateOne({ _id: msgId }, { message: newMsg });
            const message = await Message.find({ _id: msgId });
            io.to(roomId).emit('edit-message', { message });
        });
    });
}