const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },

    }]
  }  
})

userSchema.methods.addToCart = function(product) {
  let newQty = 1
  const cartProductIndex = this.cart.items.findIndex(ci => {return ci.productId.toString() === product._id.toString()})
  const updatedCartItems = [...this.cart.items]
  
  if(cartProductIndex >= 0){
    newQty = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQty
  }else{
    updatedCartItems.push({ 
      productId: product._id,
      quantity: newQty
    })
  }
  const updatedCart = {items: updatedCartItems}
  this.cart = updatedCart
  return this.save()
}

userSchema.methods.deleteCartItem = function(id) {
  const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== id.toString())
  this.cart.items = updatedCartItems
  return this.save() 
}

userSchema.methods.clearCart = function() {
  this.cart.items = []
  return this.save() 
}

module.exports = mongoose.model('User', userSchema)



// const mongodb = require('mongodb')
// const getDb = require('../utils/database').getDb
// const ObjectId = mongodb.ObjectId

// class User {
//   constructor({name, email, _id}, cart){
//     this.name = name
//     this.email = email
//     this.cart = cart
//     this.id = _id
//   }

//   save() {
//     const db = getDb().collection('users')
//     let dbOp
//     if(this._id){
//       dbOp = db.updateOne({_id: this._id}, { $set: this })
//     } else {
//       dbOp = db.insertOne(this)
//     }
//     return dbOp.then(result => {
//     }).catch(err => {console.log(err)})    
//   }

//   addToCart(product) {
//     let newQty = 1
//     const cartProductIndex = this.cart.items.findIndex(ci => {return ci.productId.toString() === product._id.toString()})
//     const updatedCartItems = [...this.cart.items]

//     if(cartProductIndex >= 0){
//       newQty = this.cart.items[cartProductIndex].quantity + 1
//       updatedCartItems[cartProductIndex].quantity = newQty
//     }else{
//       updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQty})
//     }

//     const updatedCart = {items: updatedCartItems}

//     const db = getDb()
//     return db.collection('users').updateOne({_id: ObjectId(this.id)}, {$set: {cart: updatedCart}})    
//   }

//   getCart() {
//     const db = getDb()
//     const productIds = this.cart.items.map(i => i.productId)
//     return db
//       .collection('products')
//       .find({_id: {$in: productIds}})
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {...p, quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity}
//         })
//     })
//   }

//   deleteCartItem(id){
//     const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== id.toString())
//     const db = getDb()
//     return db.collection('users').updateOne({_id: ObjectId(this.id)}, {$set: {cart: {items: updatedCartItems}}}) 
//   }

//   addOrder(){
//     const db = getDb()
//     return this.getCart()
//       .then(products => {
//         const order = 
//         { items: products,
//           user: {
//             _id: new ObjectId(this.id), name: this.name
//           }
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then(result => {
//         this.cart = {items: []}
//         const db = getDb()
//         return db.collection('users').updateOne({_id: ObjectId(this.id)}, {$set: {cart: {items: []}}})
//       })
//       .catch(err => {
//         console.log(err)
//     })
//   }

//   getOrders(){
//     const db = getDb()
//     return db.collection('orders')
//       .find({ 'user._id': new ObjectId(this.id) })
//       .toArray()   
//   }

//   static findById(id){
//     const db = getDb()
//     return db.collection('users').findOne({_id: new ObjectId(id)}).catch(err => {
//       console.log(err)
//     })
//   }
// }