const Sequelize=require('sequelize')

const sequelize=new Sequelize('expensetracker','root','eswar7396',{
    dialect:"mysql",
    host:'localhost'
})

module.exports=sequelize;
