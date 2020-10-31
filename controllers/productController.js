var productModel = require('../models/products');
var config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.addProduct = (req, res, next) => {
    const { title, price } = req.body;


    const productinstance = new productModel({
        title, price
    });

    productinstance.save({}, (err, result) => {
        if (err) {
            throw err
        }

        else {

            res.json({
                success: true,
                message: 'Product added to database'
            });
        }
    })
}

exports.productDisplay = (req, res, next) => {
    productModel.find().then(products => {
        res.json({
            success: true,
            products: products,
            message: "Successful"
        });
    });
}

exports.productUpdate = (req, res, next) => {
    productModel.findOne({ _id: req.params.id }, (err, product) => {
        if (err) return next(err);

        if (req.body.title) product.title = req.body.title;
        if (req.body.price) product.price = req.body.price;

        product.save();
        res.json({
            success: true,
            message: 'Successfully edited your product'
        });
    });
}

exports.productDelete = (req, res, next) => {
    productModel.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            next(err)
        }

        else {
            res.json({
                message: "Product deleted"
            })
        }
    })
}