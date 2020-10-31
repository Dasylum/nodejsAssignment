var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://NewDiet:Ds8764082465@cluster0.sbfkl.mongodb.net/codePartnerDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

const userRoutes = require('./routes/account');
const orderRoutes = require('./routes/cart');
const productRoutes = require('./routes/product');

app.use('/api/accounts', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product', productRoutes);

app.listen(8000, () => {
    console.log("Server running on port 8000");
})