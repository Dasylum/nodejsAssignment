var userModel = require('../models/users');
var config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
    const { username, password, email, phoneNumber, isSeller } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        const userinstance = new userModel({
            username,
            password: hashedPassword,
            email,
            phoneNumber,
            isSeller
        });

        userinstance.save({}, (err, result) => {
            if (err) {
                throw err
            }

            else {
                var token = jwt.sign({
                    user: result
                }, config.secret, {
                    expiresIn: '7d'
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                });
            }
        })
    })
}

exports.login = (req, res, next) => {
    userModel.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return done(err);
        };
        if (!user) {
            return done(null, false, { msg: "Incorrect username" });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                var token = jwt.sign({
                    user: user
                }, config.secret, {
                    expiresIn: '7d'
                });

                res.json({
                    success: true,
                    mesage: "Enjoy your token",
                    token: token
                });
            }

            else {
                return done(null, false, { message: 'Incorrect Password' })
            }
        })
    });
}

exports.profile = (req, res, next) => {
    userModel.findOne({ _id: req.decoded.user._id }, (err, user) => {
        res.json({
            success: true,
            user: user,
            message: "Successful"
        });
    });
}

exports.profileUpdate = (req, res, next) => {
    userModel.findOne({ _id: req.decoded.user._id }, (err, user) => {
        if (err) return next(err);

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

        user.isSeller = req.body.isSeller;

        user.save();
        res.json({
            success: true,
            message: 'Successfully edited your profile'
        });
    });
}

exports.profileDelete = (req, res, next) => {
    userModel.deleteOne({_id: req.decoded.user._id}, (err) => {
        if(err) {
            next(err)
        }

        else {
            res.json({
                message: "Profile deleted"
            })
        }
    })
}