const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");

exports.AllGroupParticipants = (req, res) => {
  User.findAll().then((users) => {
    res.json({ userData: users });
  });
};

exports.addChat = (req, res) => {
  const token=req.body.token
  const message=req.body.message
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);
  User.findOne({
    where:{
        id:id.userId
    }
  }).then((user)=>{
    Chat.create({message:message,sentBy:user.name})
  })

};

exports.fetchChat = (req, res) => {
  Chat.findAll()
    .then((messages) => {
      return res.json({ status: "success", messages: messages });
    })
    .catch(() => {
      return res.json({ status: "failed" });
    });
};
