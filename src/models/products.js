const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    images: [{ type: String }],
    brand: { type: String, default: '' },
    price: { type: Number, default: 0 },
    category: { type: String, ref: 'Category', required: true },
    countInStock: { type: Number, required: true, min: 0, max: 255 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now }
});

productSchema.statics.findByRating = async function(category) {
    try {
        const products = await this.find({ category }).limit(10);
        return products.map(product => ({
            productId: product._id,
            name: product.name,
            price: product.price,
            rating: product.rating,
            image: product.image,
            category: product.category
        }));
    } catch (error) {
        throw new Error("Error finding products");
    }
};

productSchema.statics.findByCategory = async function(category) {
    const products = await this.find({ category });
    return products.map(product => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        image: product.image
    }));
};

productSchema.statics.placeOrder = async function(productId, quantity) {
    const product = await this.findById(productId);
    if (product.countInStock >= parseInt(quantity)) {
        product.countInStock -= parseInt(quantity);
        await product.save();
        return true;
    } else {
        return false;
    }
};

productSchema.methods.toJSON = function () {
    const productObject = this.toObject();
    delete productObject.__v;
    return productObject;
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
