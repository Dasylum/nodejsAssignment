var express = require('express');

var route = express.Router();

var userController = require('../controllers/userController');

var checkJWT = require('../middleware/check-jwt');

route.post('/signup', userController.signup);

route.post('/login', userController.login);

route.get('/profile', checkJWT, userController.profile);

route.post('/profile', checkJWT, userController.profileUpdate);

route.get('/delete', checkJWT, userController.profileDelete);    

module.exports = route;