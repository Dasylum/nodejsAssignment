const cartModel = require('../models/cart');
const orderModel = require('../models/order');
const paymentModel = require('../models/payment');
const productModel = require('../models/products');
const userModel = require('../models/users');
const trackModel = require('../models/track');
const stripe = require('stripe');

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

exports.createOrder = function(req, res, next) {
    let stripeToken = req.body.stripeToken;
    let currentCharges;
    cartModel.findOne({ user: req.decoded.user._id }, (err, cart) => {
        if (err) return next(err);
        if (cart) {
            cart.products.map(object => {
                currentCharges += object.amount;
            })
            currentCharges = Math.round(currentCharges * 100);
            stripe.customers
                .create({
                    source: stripeToken.id
                })
                .then(function (customer) {
                    return stripe.charges.create({
                        amount: currentCharges,
                        currency: 'usd',
                        customer: customer.id
                    });
                })
                .then(function (charge) {

                    let order = new orderModel();
                    order.id = create_UUID();
                    order.user = req.decoded.user._id;
                    order.amount = currentCharges;
                    order.cart = cart._id
                    order.billingAddress = req.body.billingAddress;
                    order.shippingAddress = req.body.shippingAddress;
                    order.isPaid = true;
                    order.isFullFilled = false;

                    const trackInstance = new trackModel({
                        trackingId: create_UUID(),
                        deliverService: 'UPS'
                    })

                    trackInstance.save((err, result) => {
                        if (err) return next(err)
                        if(result) {
                            order.tracking = result._id;
                        }
                    });

                    const payment = new paymentModel();
                    payment.amount = currentCharges;
                    payment.isPaid = true;
                    payment.user = req.decoded.user._id;
                    payment.save((err, result) => {
                        if(err) return next(err)
                        if(result) {
                            order.payment.push(result._id);
                        }
                    });

                    order.save();
                    res.json({
                        success: true,
                        message: "Successfully made a payment"
                    });
                });
        }
    })
}

const calculateAmount = (id, quant) => {
    productModel.findOne({ _id: id }, (err, result) => {
        if (err) return next(err)
        if (result) {
            return result.price * quant;
        }
    })
}

exports.cartDisplay = function(req, res, next) {
    userModel.findOne({ _id: req.decoded.user._id }, (err, user) => {
        if (user) {
            cartModel.findOne({ user: user._id }, (err, result) => {
                if (result) {
                    res.json({
                        success: true,
                        content: result,
                        message: "Successful"
                    });
                }
                if (!result) {
                    res.json({
                        success: true,
                        message: "Cart is empty"
                    });
                }
                if (err) return next(err);
            })
        }
        if (err) return next(err);
    });
}

exports.cartAdd = function(req, res, next) {
    userModel.findOne({ _id: req.decoded.user._id }, (err, user) => {
        if (err) return next(err);

        if (user) {
            cartModel.findOne({ user: user._id }, (err, cart) => {
                console.log(cart);
                if (cart) {
                    cart.products.push({ product: req.params.productId, quantity: req.body.quantity, amount: calculateAmount(req.params.productId, req.body.quantity) })
                }
                if (!cart) {
                    const products = [{ product: req.params.productId, quantity: req.body.quantity, amount: calculateAmount(req.params.productId, req.body.quantity) }]
                    const cartInstance = new cartModel();
                    cartInstance.products = products;
                    cartInstance.user = req.decoded.user._id;
                    cartInstance.save();
                    res.json({
                        success: true,
                        message: 'Successfully added a product'
                    })
                }
                if (err) return next(err);
            })
        }
    });
}

exports.cartDelete = function(req, res, next) {
    userModel.findOne({ _id: req.decoded.user._id }, (err, user) => {
        if (err) return next(err);

        if (user) {
            cartModel.findOne({ user: user._id }, (err, cart) => {
                if (cart) {
                    const index = cart.products.findIndex(product => product.product == req.params.productId);
                    if (index > -1) {
                        cart.products.splice(index, 1);
                        cart.save();
                        res.json({
                            success: true,
                            message: 'Successfully deleted a product'
                        })
                    }
                }
                if (err) return next(err);
            })
        }
    });
}