const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

// Define a virtual field to calculate the total price for each order item
orderItemSchema.virtual('totalPrice').get(function() {
    return this.quantity * this.product.price;
});

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
