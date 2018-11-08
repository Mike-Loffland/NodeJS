const mysql2 = require('mysql2')
const connection = require('./mysqlconnection')
// two ways to connect
// 1 - setup one single connection

// 2 - connection pools
const pool = mysql2.createPool({
  host: connection.host,
  user: connection.user,
  database: connection.database,
  password: connection.password,
})

module.exports = pool.promise()
