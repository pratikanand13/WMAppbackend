const mongoose = require('mongoose');
const User = require('../models/user');

const wishlistSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

wishlistSchema.statics.findAll = async function(userId) {
    const userWishlist = await this.find({ user: userId }).populate('product');
    return userWishlist;
};

wishlistSchema.set('toJSON', { virtuals: true });

const WishList = mongoose.model('WishList', wishlistSchema);
module.exports = WishList;
