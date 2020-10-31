var mongoose = require('mongoose');

var schema = mongoose.Schema({
    trackingId: {type: String, required: true},
    deliveryService: {type: String, required: true}
})

module.exports = mongoose.model('trackModel', schema);