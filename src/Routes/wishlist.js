const express = require('express');
const WishList = require('../models/wishlist');
const Product = require('../models/products');
const auth = require('../middleware/userAuth');
const router = new express.Router();

router.get('/wishlist/getItem', auth, async (req, res) => {
    try {
        const items = await WishList.findAll(req.user._id);
        res.status(200).send(items);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.post('/wishlist/addItem', auth, async (req, res) => {
    const { product, quantity } = req.body;
    try {
        const newItem = new WishList({
            user: req.user._id,
            product,
            quantity
        });
        await newItem.save();
        res.status(201).send(newItem);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.delete('/wishlist/removeItem/:id', auth, async (req, res) => {
    try {
        const item = await WishList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!item) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.status(200).send(item);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;
