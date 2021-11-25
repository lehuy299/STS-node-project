
const dotenv = require('dotenv')
dotenv.config()
const Message = require('../model/message.js');
const User = require('../model/user.js');
let io;
const jwt = require('jsonwebtoken');
const Chatroom = require('../model/chatroom.js');

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
        //console.log('A user connected: ' + socket.username);

        socket.on('disconnect', () => {
            //console.log('A user disconnected: ' + socket.username);
        });

        socket.on("join-room", async (roomId, curUser) => {
            socket.join(roomId);
            await Message.updateMany({ user: { $ne: socket.username }, chatroom: roomId }, { $addToSet: { seenList: [curUser] } });
            const message = await Message.find({ chatroom: roomId });
            
            io.to(roomId).emit('seen-message', { message });
        });

        socket.on('chat-message', async (msg, roomId, timeNow) => {
            const user = await User.findOne({ username: socket.username });
            const newMessage = await new Message({ user: user.username, message: msg, chatroom: roomId, sentTime: timeNow });
            await newMessage.save();
            io.to(roomId).emit('receive-message', { message: msg, username: user.username, id: newMessage._id, sentTime: timeNow });
        });

        socket.on('edit-message', async (msgId, newMsg, roomId) => {
            //update the message and return it to client
            await Message.updateOne({ _id: msgId }, { message: newMsg });
            const message = await Message.find({ _id: msgId });
            io.to(roomId).emit('edit-message', { message });
        });

        socket.on('create-room', async (roomName) => {
            let newRoom;
            let roomNameSplit = roomName.split('--with--');
            if (roomNameSplit.length > 1){
                let usernames = [...new Set(roomNameSplit)].sort((a, b) => (a < b ? -1 : 1));
                roomName = `${usernames[0]}--with--${usernames[1]}`;
                newRoom = await Chatroom.findOne({ name: roomName });
                    if(!newRoom){ 
                        newRoom = await new Chatroom({ name: roomName, authUsers: usernames });
                        await newRoom.save();
                    }
            }
            else {
                newRoom = await new Chatroom({ name: roomName });
                await newRoom.save();
            }
            const roomId = newRoom._id;
            io.emit('receive-room', { roomName, roomId });
        })
    });
}