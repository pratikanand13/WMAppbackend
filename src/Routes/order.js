const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose');
const userAuth = require('../middleware/userAuth')
const Product = require('../models/products')
const OrderItem = require('../models/order-item')
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



router.post('/order', async (req, res) => {
    try {
        const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, user } = req.body;

        
        const createdOrderItems = await Promise.all(orderItems.map(async item => {
            const product = await Product.findById(item.product);
            if (!product) throw new Error('Product not found');

            const orderItem = new OrderItem({
                quantity: item.quantity,
                product: product._id
            });
            await orderItem.save();

            // Update stock
            const orderPlaced = await Product.placeOrder(item.product, item.quantity);
            if (!orderPlaced) throw new Error('Not enough stock available');

            return orderItem._id;
        }));

        
        const order = new Order({
            orderItems: createdOrderItems,
            shippingAddress1,
            shippingAddress2,
            city,
            zip,
            country,
            phone,
            user
        });

        await order.calculateTotalPrice();
        await order.save();

        res.status(201).send(order);
    } catch (err) {
        res.status(500).send(err.message);
    }
});




module.exports = router
