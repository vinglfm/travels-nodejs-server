const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('../config');

router.post('/signIn', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password
    }, function(error, user) {
        if(error) {
            return next(error);
        } else {
            return res.json({ 
                user: user.email,
                token: 5,
                firstName: user.firstName,
                lastName: user.lastName
            });
        }
    });
});

router.post('/signUp', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, function(error, user) {
        if(error) {
            return next(error);
        } else {
            const token = jwt.sign({'user': user.email}, config.secret, {
                expiresIn : 1440
              });
            return res.json({ 
                user: user.email,
                token: token,
                firstName: user.firstName,
                lastName: user.lastName
            });
        }
    });
});

module.exports = router;