const express = require('express')
const router = new express.Router()
const userAuth = require('../middleware/userAuth')
const Product = require('../models/products')
const Order_item = require('../models/order-item')
const Order = require('../models/order')

router.get('/order/:id/:quantity',userAuth, async(req,res)=> {
    // console.log('1')
    const productId = req.params.id 
    const quantity = req.params.quantity
    const placeorder = await Product.placeOrder(productId,quantity)
    
    if (placeorder)
        res.status(205).send("You can place")
    else res.status(405).send("not much stock available")
})

router.post('/order/')

module.exports = router
