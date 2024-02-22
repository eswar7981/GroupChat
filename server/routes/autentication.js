const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const AutenticationController=require('../controllers/AutenticationControllers')


router.get('/ConfirmResetPassword/',AutenticationController.resetPassword)

router.post('/resetPassword',AutenticationController.resetthePassword)

router.post("/login",AutenticationController.GetLoginDetails)

router.post("/signUp",AutenticationController.GetSignupDetails)


router.post("/logout",AutenticationController.logOut)




module.exports=router