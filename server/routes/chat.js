const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const ChatController=require('../controllers/ChatController')



router.get('/getParticipants',ChatController.AllGroupParticipants)

router.post('/addMessage',ChatController.addChat)

router.get('/getMessages',ChatController.fetchChat)

module.exports=router