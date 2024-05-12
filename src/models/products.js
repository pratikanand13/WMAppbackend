const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: {
        type: String,
        ref: 'Category',
        required:true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.statics.findByRating = async (category) => {
    try {
        const products = await Product.find({ category }).limit(10);
        
        const formattedProducts = products.map(product => ({
            productId: product._id,
            name: product.name,
            price: product.price,
            rating: product.rating,
            image: product.image // Assuming image field is stored as URL in the database
        }));

        return formattedProducts;
    } catch (error) {
        throw new Error("Error finding products")
    }
};

productSchema.statics.findByCategory = async (category) => {
    const products = await Product.find({ category })
    const formattedProducts = products.map(product => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        image: product.image // Assuming image field is stored as URL in the database
    }));

    return formattedProducts;
}



const Product = mongoose.model('Product', productSchema);
module.exports = Product