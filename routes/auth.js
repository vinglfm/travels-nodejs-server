const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('../config');

const maskPassword = (password) => {
    return config.auth.mask + password.toUpperCase().substr(4);
};

const generateToken = (user, password) => {
    return  jwt.sign({
        'user': user,
        'password': maskPassword(password) 
    }, config.auth.secret, {
        expiresIn: 1440
    });
};

router.post('/signIn', (req, res) => {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
        if(error) {
            return next(error);
        } else if (!user) {
            const err = new Error('User credentials is not correct');
            err.status = 401;
            return next(err);
        } else {
            return res.json({ 
                user: user.email,
                token: generateToken(user.email, user.password),
                firstName: user.firstName,
                lastName: user.lastName
            });
    }});
});

router.post('/signUp', (req, res, next) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, function(error, user) {
        if(error) {
            return next(error);
        } else {
            return res.json({ 
                user: user.email,
                token: generateToken(user.email, user.password),
                firstName: user.firstName,
                lastName: user.lastName
            });
        }
    });
});

module.exports = router;