const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const Group=sequelize.define('Group',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    participants:{
        type:Sequelize.STRING,
        allowNull:false
    },
    admin:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Group