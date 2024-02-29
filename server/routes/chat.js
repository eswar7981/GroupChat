const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const ChatController=require('../controllers/ChatController')



router.post('/getParticipants',ChatController.getAllParticipants)

router.post('/addMessage',ChatController.addChat)

router.post('/getMessages',ChatController.fetchChat)

router.post('/createGroup',ChatController.createGroup)

router.get('/fetchAllGroups',ChatController.fetchAllGroups)

router.post('/makeOrRemoveAsAdmin',ChatController.makeOrRemoveAsAdmin)

router.post('/removeUser',ChatController.removeUser)
module.exports=router