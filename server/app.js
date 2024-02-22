const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const User = require("./models/User");
const ChatRoutes = require("./routes/chat");
const Authroutes = require("./routes/autentication");
const sequelize = require("./util/database");

const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const accessLog = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(helmet());
app.use(morgan("combined", { stream: accessLog }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/autentication", Authroutes);
app.use(
  "/chat",
  ChatRoutes
);

sequelize.sync().then(() => {
  app.listen(5000);
});
