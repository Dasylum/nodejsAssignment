var mongoose = require('mongoose');

var schema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String},
    phoneNumber: {type: String},
    isSeller: {type: Boolean}
})

module.exports = mongoose.model('userModel', schema);