var express = require('express');

var route = express.Router();

var productController = require('../controllers/productController');

var checkJWT = require('../middleware/check-jwt');

route.post('/addProduct', checkJWT, productController.addProduct);

route.get('/productDisplay', productController.productDisplay);

route.post('/productUpdate/:id', checkJWT, productController.productUpdate);

route.get('/productDelete/:id', checkJWT, productController.productDelete);    

module.exports = route;