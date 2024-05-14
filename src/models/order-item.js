const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

orderItemSchema.virtual('totalPrice').get(function() {
    return this.quantity * this.product.price;
});

orderItemSchema.set('toJSON', { virtuals: true });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;
