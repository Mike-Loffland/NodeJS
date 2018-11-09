//http://docs.sequelizejs.com/manual/installation/usage.html
const Sequelize = require('sequelize') // mysql2 must be installed for sequilize to work
const connection = require('./mysqlconnection')

// sequelize is an object relational mapping library (like Entity Framework)
const sequelize = new Sequelize(connection.database, connection.user, connection.password, {
  dialect: connection.dialect,
  host: connection.host,
})

module.exports = sequelize
