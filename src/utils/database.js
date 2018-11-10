const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const db = require('./mysqlconnection')
let _db

const mongoConnect = callback => {
  MongoClient.connect(db.mongoDbConnectionString).then(client => {
    _db = client.db()
    callback()
  }).catch(err => {
    console.log(err)
    throw err
  })
}

const getDb = () => {
  if(_db) {
    return _db
  }
  throw '_db was null in getDb()'
}

exports.mongoConnect = mongoConnect
exports. getDb = getDb
 