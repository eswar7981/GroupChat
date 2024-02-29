const User = require("../models/User");
const { use } = require("../routes/autentication");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
const { SharedIniFileCredentials } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { Transaction } = require("sequelize");

const generateToken = (id) => {
  return jwt.sign({ userId: id },`${process.env.SECRET_KEY}`);
};

exports.GetSignupDetails = (req, res) => {
  const name = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber=req.body.phoneNumber
  User.findOne({
    where: {
      emailAddress: email,
    },
  })
    .then((data) => {
      console.log(data);
      if (data == null) {
        bcrypt.hash(password, 10, async (err, hash) => {
          await User.create({
            name: name,
            emailAddress: email,
            phoneNumber:phoneNumber,
            password: hash,
            belongsToGroups:','
          });
        });
        res.json({message:"signup successful"});
      } else {
        res.json({ message: "email is already taken" });
      }
    })
    .catch(() => {});
};

exports.logOut = (req, res) => {
  const token=req.body.token
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);
  User.findOne({
    where:{
      id:id.userId
    }
  }).then((user)=>{
    user.update({status:false})
  })
  res.json("logout");
};



exports.GetLoginDetails = (req, response) => {
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10, async (err, hash) => {
    User.findOne({
      where: {
        emailAddress: email,
      },
    })
      .then((res) => {
        bcrypt.compare(password, res.password, (err, resp) => {
          if (!err) {
            if (resp === true) {
            
              const token = generateToken(res.id);
              res.update({status:true})
              response.json({login:'success', token: token,email:email });
            } else {
              response.json({login:'failed'});
             
            }
          }
        });
      })
      .catch((err) => {
        response.json({login:"user not found"});
        console.log(err);
      });
  });
};



exports.resetPassword = (req, res) => {
  const idUser = req.params.id;

  ForgotPasswordRequests.findOne({
    where: {
      id: idUser,
      isActive: true,
    },
  })
    .then((request) => {
      res.json({ id: request.UserId });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.resetthePassword = (req, res) => {
  const password = req.body.password;
  const id = req.body.id;
  const uuid = req.body.uuid;
  console.log(password, id);
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      bcrypt.hash(password, 10, async (err, hash) => {
        await user.update({ password: hash });
      });
    })
    .then(() => {
      ForgotPasswordRequests.findOne({
        where: {
          id: uuid,
        },
      })
        .then((request) => {
          request.update({ isActive: false });
        })
        .then(() => {
          res.json("successful");
        });
    });
};
