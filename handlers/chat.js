const Chatroom = require('../model/chatroom.js');
const Message = require('../model/message.js');
const User = require('../model/user.js');

exports.getChatroom = async (req, res) => {
    const username = req.username;
    let chatroom = req.query.room || "";

    const user = await User.findOne({ username: username });
    let messages;
    if (chatroom) {
        const room = await Chatroom.findById({ _id: chatroom });
        if(room.authUsers.length > 0 && !room.authUsers.includes(username)) return res.sendStatus(403);
        messages = await Message.find({ chatroom: room });
    }
    const allRooms = await Chatroom.find({});
    const newAllRooms = [];
    allRooms.forEach(room => {
        if((room.authUsers.length != 0 && room.authUsers.includes(username)) || room.authUsers.length == 0) {
            newAllRooms.push(room);
        }
    });

    res.render('pages/chatroom', { user, messages, newAllRooms, chatroom });
};

