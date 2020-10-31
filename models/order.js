var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    orderId: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: 'cart', required: true},
    amount: {type: Number, required: true},
    billingAddress: {type: String, required: true},
    shippingAddress: {type: String, required: true},
    payment: [{type: mongoose.Schema.Types.ObjectId, ref: 'payment', required: true}],
    isPaid: {type: Boolean, required: true},
    isFullfilled: {type: Boolean, required: true},
    tracking: [{type: mongoose.Schema.Types.ObjectId, ref: 'track'}]
})

module.exports = mongoose.model('orderModel', orderSchema);