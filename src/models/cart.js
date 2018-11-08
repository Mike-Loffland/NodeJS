const fs = require('fs')
const path = require('path')
const rootDir = require('../utils/path')

const p = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {
  static addProduct({ id, price }) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      const existingProductIndex = cart.products.findIndex(p => p.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty++
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +price
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err)
      })
    })
  }

  static removeProduct({ id, price }) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // no cart
        return
      } else {
        let cart = JSON.parse(fileContent)
        let deletedCartProduct = cart.products.find(p => p.id === id)
        if (!deletedCartProduct) {
          return
        }
        let subtractPrice = price * deletedCartProduct.qty
        cart.products = cart.products.filter(p => p.id !== id)
        cart.totalPrice = cart.totalPrice - subtractPrice
        fs.writeFile(p, JSON.stringify(cart), err => {
          console.log(err)
        })
      }
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb({ products: [], totalPrice: 0 })
      } else {
        let cart = JSON.parse(fileContent)
        cb(cart)
      }
    })
  }
}
