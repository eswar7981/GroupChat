const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ChatController = require("../controllers/ChatController");

router.get("/getAllUsers", ChatController.getAllUsers);

router.post("/createGroup", ChatController.createGroup);

router.get("/fetchAllGroups", ChatController.fetchAllGroups);

router.post("/makeOrRemoveAsAdmin", ChatController.makeOrRemoveAsAdmin);

router.post("/removeUser", ChatController.removeUser);

module.exports = router;
