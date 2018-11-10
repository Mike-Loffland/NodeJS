const mongodb = require('mongodb')
const getDb = require('../utils/database').getDb

class Product {
  constructor({title, price, description, imageUrl, id}){
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? mongodb.ObjectId(id) : null
  }

  save() {
    const db = getDb().collection('products')
    let dbOp
    if(this._id){
      dbOp = db.updateOne({_id: this._id}, { $set: this })
    } else {
      dbOp = db.insertOne(this)
    }

    return dbOp.then(result => {
    }).catch(err => {console.log(err)})
  }

  static fetchAll() {
    // find returns a cursor
    const db = getDb()
    return db.collection('products').find().toArray()
      .then(products => {
        return products
      }).
      catch(err => {
        console.log(err)
    })
  }

  static getById(id) {
    // find returns a cursor
    const db = getDb()
    return db.collection('products').find({_id: new mongodb.ObjectId(id)}).next()
      .then(product => {
        return product
      }).
      catch(err => {
        console.log(err)
    })
  }
  
  static deleteById(id){
    const db = getDb()
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
      .then(result => {
        console.log(`Deleted product: ${id}`)
      }).
      catch(err => {
        console.log(err)
    })    
  }
}

module.exports = Product