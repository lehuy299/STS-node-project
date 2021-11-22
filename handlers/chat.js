const Chatroom = require('../model/chatroom.js');
const Message = require('../model/message.js');
const User = require('../model/user.js');

exports.getChatroom = async (req, res) => {
    const username = req.username;
    let chatroom = req.query.room || "";
    // let split = chatroom.split('--with--');
    // if (split.length > 1){
    //     if(!split.includes(username)) return res.sendStatus(403);
    //     let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
    //     chatroom = `${unique[0]}--with--${unique[1]}`;
    // }
    const user = await User.findOne({ username: username });
    let messages;
    if (chatroom) {
        const room = await Chatroom.findById({ _id: chatroom });
        messages = await Message.find({ chatroom: room });
    }

    const allRooms = await Chatroom.find({});

    res.render('pages/chatroom', { user, messages, allRooms, chatroom });
};

exports.createRoom = async(req, res) => {
    const roomName = req.body.room || "";
    const newRoom = await new Chatroom({ name: roomName });
    await newRoom.save();
    res.redirect(`/chat?room=${newRoom._id}`);
};
