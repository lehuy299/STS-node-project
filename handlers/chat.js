const Chatroom = require('../model/chatroom.js');
const Message = require('../model/message.js');

exports.getChatroom = async (req, res) => {
    const username = req.username;
    let chatroom = req.query.room;
    let split = chatroom.split('--with--');
    if (split.length > 1){
        if(!split.includes(username)) return res.sendStatus(403);
        let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
        chatroom = `${unique[0]}--with--${unique[1]}`;
    }
    const room = await Chatroom.find({ name: chatroom });
    const messages = await Message.find({ chatroom: room }).sort({$natural:-1}).limit(50);
    //await Message.updateMany({ user: { $ne: username }}, {$addToSet: {seenList: [username]}});
    res.render('pages/chatroom', { username, messages });
};
