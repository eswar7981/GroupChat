const Sequelize=require('sequelize')

const sequelize=new Sequelize('groupchatapplication','root','eswar7396',{
    dialect:"mysql",
    host:'localhost'
})

module.exports=sequelize;
