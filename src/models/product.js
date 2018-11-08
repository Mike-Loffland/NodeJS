// MODEL - represent data, managing data, data-related logic

const fs = require('fs')
const path = require('path')
const rootDir = require('../utils/path')
const Cart = require('../models/cart')

const p = path.join(rootDir, 'data', 'products.json')

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor({ id, title, imageUrl, price, description }) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = +price
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id)
        products[existingProductIndex] = this
      } else {
        this.id = Math.random().toString()
        products.push(this)
      }
      fs.writeFile(p, JSON.stringify(products), error => {
        if (error) {
          console.log(error)
        }
      })
    })
  }

  static delete(id, cb) {
    getProductsFromFile(products => {
      const deletedProduct = products.find(p => p.id === id)
      const updatedProducts = products.filter(p => p.id !== id)
      fs.writeFile(p, JSON.stringify(updatedProducts), error => {
        if (error) {
          console.log(error)
        } else {
          Cart.removeProduct(deletedProduct)
          cb()
        }
      })
    })
  }

  static getProduct(id, cb) {
    getProductsFromFile(products => {
      cb(products.find(p => p.id === id))
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }
}
