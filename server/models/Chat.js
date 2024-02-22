const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const Chat=sequelize.define('Chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    sentBy:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
  
})

module.exports=Chat