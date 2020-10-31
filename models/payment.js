var mongoose = require('mongoose');

var schema = mongoose.Schema({
    amount: {type: Number, required: true},
    isPaid: {type: Boolean, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
})

module.exports = mongoose.model('paymentModel', schema);