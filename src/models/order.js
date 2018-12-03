const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  products:[{
    productData: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
    }
  }],
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    }
  }
})

// mongoose will create a collection if it's not there (it will pluralize as well)
module.exports = mongoose.model('Order', orderSchema)