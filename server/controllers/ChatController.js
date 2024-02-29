const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Group = require("../models/Group");

const { use, all } = require("../routes/chat");
const { where } = require("sequelize");

exports.getAllParticipants = (req, res) => {
  const GroupId = req.body.groupId;
  Group.findOne({
    where: {
      id: GroupId,
    },
  }).then((group) => {
    users = [];
    group.participants.split(",").map((id) => {
      async function getEachParticipant() {
        const data = await User.findOne({
          where: {
            id: id,
          },
        });
        const userData = await data;
        users = [...users, userData];
      }
      getEachParticipant();
    });

    setTimeout(() => {
      res.json({ status: "success", users: users, admin: group.admin });
    }, 1000);
  });
};

exports.AllGroupParticipants = (req, res) => {
  const groupId = req.body.groupId;
  console.log(groupId, "all group members");
  Group.findOne({
    where: {
      id: groupId,
    },
  }).then((memebers) => {
    return res.json({ status: "success", participants: memebers });
  });
};

exports.addChat = (req, res) => {
  const token = req.body.token;
  const message = req.body.message;
  const sentBy = req.body.sentBy;
  const groupId = req.body.groupId;
  Group.findOne({
    where: {
      id: groupId,
    },
  }).then((group) => {
    Chat.create({ message: message, sentBy: sentBy, GroupId: groupId });
  });
  ("const id = jwt.verify(token, `${process.env.SECRET_KEY}`);");
};

exports.fetchChat = (req, res) => {
  const groupId = req.body.groupId;
  console.log(groupId);
  Chat.findAll({
    where: {
      GroupId: groupId,
    },
  })
    .then((messages) => {
      return res.json({ status: "success", messages: messages });
    })
    .catch(() => {
      return res.json({ status: "failed" });
    });
};

exports.createGroup = (req, res) => {
  const groupName = req.body.name;
  const participants = req.body.participants;
  const admin = req.body.admins;
  const token = req.body.token;
  const id = jwt.verify(token, `${process.env.SECRET_KEY}`);
  User.findOne({
    where: {
      id: id.userId,
    },
  }).then((user) => {
    const addedUserToParticipants = participants + user.id.toString();
    const addedAdmin = admin + user.id.toString();
    Group.create({
      groupName: groupName,
      participants: addedUserToParticipants,
      admin: addedAdmin,
    })
      .then(() => {
        Group.count().then((count) => {
          console.log("count", count);
          addedUserToParticipants.split(",").map((i) => {
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

exports.removeUser=(req,res)=>{
  const id=req.body.id
  const groupId=req.body.groupId
  Group.findOne({
    where:{
      id:groupId
    }
  }).then((group)=>{
    const participants=group.participants.split(',')
    const admins=group.admin.split(',')
    const participantsAfterRemoved=participants.filter((partici)=>partici!=id)
    const updatedAdmins = admins.filter((Id) => Id != id);
  
    group.update({participants:participantsAfterRemoved.join(','), admin: updatedAdmins.join(',') })
    res.json({status:'success'})
  })
}

exports.fetchAllGroups = (req, res) => {
  const token = req.headers.token;
  const id = jwt.verify(token, `${process.env.SECRET_KEY}`);
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

exports.makeOrRemoveAsAdmin = (req, res) => {
  const id = req.body.id;
  const groupId = req.body.groupId;
  Group.findOne({
    where: {
      id: groupId,
    },
  }).then((group) => {
    if(group.admin===''){
      var admins=[]
    }else{
      var admins = group.admin.split(",");
    }
    
    if (admins.includes(id.toString())) {

      const updatedAdmins = admins.filter((Id) => Id != id);
      group.update({ admin: updatedAdmins.join(',') });
      res.json({status:'success',message:'removed as admin'})
    } else {
  
      admins.push(id);
      group.update({ admin: admins.join(',')});
      res.json({status:'success',message:'is now admin'})

    }

   
  });
};
