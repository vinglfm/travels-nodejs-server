const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../model/user');
const config = require('../config');
require('../common/passport')();

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

router.post('/signIn', (req, res, next) => {
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
                fullName: user.fullName
            });
    }});
});

router.route('/facebook')
    .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }

        const token = generateToken(req.user.email, req.user.email);
        res.setHeader('x-auth-token', token);
        return res.status(200).json(req.user);
    });

router.post('/signUp', (req, res, next) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.firstName + ' ' + req.body.lastName
    }, function(error, user) {
        if(error) {
            return next(error);
        } else {
            return res.json({ 
                user: user.email,
                token: generateToken(user.email, user.password),
                fullName: user.fullName
            });
        }
    });
});

module.exports = router;