
const Message = require('../model/message.js');

exports.getChatroom = async (req, res) => {
    const username = req.username;
    const chatroom = req.query.room;
    let split = chatroom.split('--with--');
    if (split.length > 1){
        if(!split.includes(username)) return res.sendStatus(403);
    }
    const messages = await Message.find({ chatroom: chatroom });
    res.render('pages/chatroom', { username, messages });
};
