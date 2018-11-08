// MODEL - represent data, managing data, data-related logic
const dbPool = require('../utils/database')

const Cart = require('../models/cart')

module.exports = class Product {
  constructor({ id, title, imageUrl, price, description }) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = +price
  }

  save() {
    //returns a promise
    return dbPool.execute('INSERT INTO products (title, price, imageUrl, description) VALUES(?, ?, ?, ?)', [
      this.title,
      this.price,
      this.imageUrl,
      this.description,
    ])
  }

  static delete(id) {}

  static getProduct(id) {
    return dbPool.execute('SELECT * FROM products WHERE id = ?', [id])
  }

  static fetchAll() {
    return dbPool.execute('SELECT * FROM products')
  }
}
