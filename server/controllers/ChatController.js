const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Group = require("../models/Group");
const io=require('socket.io')

const { use, all } = require("../routes/chat");
const { where } = require("sequelize");

const cron = require("node-cron");


cron.schedule("0 0 * * *", () => {
  Chat.drop();
})


exports.createGroup = (req, res) => {
  const groupName = req.body.name;
  const participants = req.body.participants.slice(0,req.body.participants.length-1);
  const admin = req.body.admins.slice(0,req.body.admins.length-1);
  const token = req.body.token;
  const id = jwt.verify(token, `${process.env.SECRET_KEY}`);
  User.findOne({
    where: {
      id: id.userId,
    },
  }).then((user) => {

  
    Group.create({
      groupName: groupName,
      participants: participants,
      admin:admin,
    })
      .then(() => {
        Group.count().then((count) => {
          console.log("count", count);
          participants.split(",").map((i) => {
            const currUser = i;

            User.findOne({
              where: {
                id: currUser,
              },
            }).then((user) => {
              user.update({
                belongsToGroups: user.belongsToGroups + count.toString() + ",",
              });
            });
          });
        });
      })
      .then(() => {
        return res.json({ status: "success" });
      })
      .catch(() => {
        return res.json({ status: "failed" });
      });
  });
};

exports.removeUser = (req, res) => {
  const id = req.body.id;
  const groupId = req.body.groupId;
  const userId=req.body.userId;
  Group.findOne({
    where: {
      id: groupId,
    },
  }).then((group) => {
    const participants = group.participants.split(",");
    const admins = group.admin.split(",");
    const participantsAfterRemoved = participants.filter(
      (partici) => partici != id
    );
    const updatedAdmins = admins.filter((Id) => Id != id);

    group.update({
      participants: participantsAfterRemoved.join(","),
      admin: updatedAdmins.join(","),
    });
    res.json({ status: "success" });
  });
};

exports.fetchAllGroups = (req, res) => {
  const token = req.headers.token;
  const id = jwt.verify(token, `${process.env.SECRET_KEY}`);
  console.log('called')
  User.findOne({
    where: {
      id: id.userId,
    },
  }).then(async (user) => {
    if (user.belongsToGroups === null) {
      res.json({ status: "failed", reason: "no groups found" });
    } else {
      groupData = [];
      const groups = await user.belongsToGroups
        .slice(1, user.belongsToGroups.length - 1)
        .split(",")
        .map(async (groupNo) => {
          const a = await Group.findOne({
            where: {
              id: groupNo,
            },
          }).then((group) => {
            groupData.push(group);
          });
        });
      setTimeout(() => {
        res.json({ status: "success", groups: groupData });
      }, 1000);
    }
  });
};

exports.getAllUsers=(req,res)=>{
  User.findAll().then((users)=>{
    res.json({status:'success',users:users})
  })
}

exports.makeOrRemoveAsAdmin = (req, res) => {
  const id = req.body.id;
  const groupId = req.body.groupId;
  Group.findOne({
    where: {
      id: groupId,
    },
  }).then((group) => {
    if (group.admin === "") {
      var admins = [];
    } else {
      var admins = group.admin.split(",");
    }

    if (admins.includes(id.toString())) {
      const updatedAdmins = admins.filter((Id) => Id != id);
      group.update({ admin: updatedAdmins.join(",") });
      res.json({ status: "success", message: "removed as admin" });
    } else {
      admins.push(id);
      group.update({ admin: admins.join(",") });
      res.json({ status: "success", message: "is now admin" });
    }
  });
};
