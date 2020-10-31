var express = require('express');
const checkJWT = require('../middleware/check-jwt');
var route = express.Router();

const orderController = require('../controllers/orderController');

route.get('/cart', checkJWT, orderController.cartDisplay);

route.post('/cart/:productId', checkJWT, orderController.cartAdd);

route.delete('/cart/:productId', checkJWT, orderController.cartDelete)

route.post('/payment', checkJWT, orderController.createOrder);

module.exports = route;