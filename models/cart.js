var mongoose = require('mongoose');

var schema = mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products'},
        quantity: { type: Number, default: 1 },
        amount: { type: Number }
    }],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('cartModel', schema);