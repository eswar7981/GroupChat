const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const User = require("./models/User");
const Group = require("./models/Group");
const Chat = require("./models/Chat");

const ChatRoutes = require("./routes/chat");
const Authroutes = require("./routes/autentication");
const sequelize = require("./util/database");

const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { GetSignupDetails } = require("./controllers/AutenticationControllers");
const { type } = require("os");

const accessLog = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(helmet());
app.use(morgan("combined", { stream: accessLog }));
app.use(
  cors({
    origin: "http://16.171.206.103",
  })
);
app.use(express.json());
app.use(express.static("images"));
app.use(express.urlencoded({ extended: false }));

User.hasMany(Group);
Group.hasMany(User);

Group.hasMany(Chat, { foreignKey: "id" });
Chat.belongsTo(Group);

app.use("/autentication", Authroutes);
app.use("/chat", ChatRoutes);

sequelize.sync().then(() => {
  server.listen(5000);
});

io.on("connection", (socket) => {

  socket.on('getPartcipants',id=>{
    const GroupId = id
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
        socket.emit('recievePartcipants',users)
      }, 1000);
    });
  })

  socket.on('getAdmins',details=>{
    const token=details.token
    const groupId=details.groupId
    Group.findOne({
      where:{
        id:groupId
      }
    }).then((group)=>{
      socket.emit('adminData',group.admin)
    })
  })


  socket.on('sendMessage',details=>{

    const token = details.token;
    const message = details.message;
    const sentBy = details.sentBy;
    const groupId = details.groupId;
    Group.findOne({
      where: {
        id: groupId,
      },
    }).then((group) => {
      Chat.create({ message: message, sentBy: sentBy, GroupId: groupId });
    });
    ("const id = jwt.verify(token, `${process.env.SECRET_KEY}`);");
  
  })


  


  socket.on('getMessage',id=>{
    const groupId =id
    Chat.findAll({
      where: {
        GroupId: groupId,
      },
    })
      .then((messages) => {
        socket.emit('data',messages)
      })
      
  })

  
  })

  

