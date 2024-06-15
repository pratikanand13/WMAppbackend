const express = require('express')
const Product = require('../models/products')
const mongoose = require('mongoose');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middleware/userAuth')
// GET all products
router.get('/list',auth, async (req, res) => {
    // console.log(req.user)
    let genre = await User.getuserGenre(req.user._id)
    // let Usergenre = JSON.stringify(genre)
    // console.log(Usergenre)
    const categories = ['ANTHOLOGY', 'POETRY', 'MEMOIR', 'SHORT_STORIES','HISTORICAL_FICTION','LITERARY _RESEARCH_PAPER','CLASSIC','CRIME_THRILLER','HORROR','SHORT STORIES_&_ESSAYS','CHILDREN_ BOOK','BIOGRAPHY',''];
    categories.push(genre)
    // console.log(categories)
    try {
        const topProductsPromises = categories.map(category => Product.findByRating(category));
        
        const topProductsArrays = await Promise.all(topProductsPromises);
        
        res.json(topProductsArrays);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//GET Product by id

    router.get('/list/:category' ,auth, async(req,res)=> {
        let productCategory= req.params.category
        
        try{
        const productList = await Product.findByCategory(productCategory)
        
        res.json(productList)
        } catch (e) {
            res.status(500).send(e.message)
        }

    })

    router.post('/list/:id', auth, async (req, res) => {
        try {
            const productId = req.params.id;
            console.log(productId);
            const objectId = new mongoose.Types.ObjectId(productId);
            console.log(objectId);
            const product = await Product.findById(objectId);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.send(product);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });     

module.exports = router