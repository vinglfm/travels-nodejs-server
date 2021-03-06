const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../model/user');
const config = require('../config');
require('../common/passport')();

const maskPassword = (password) => {
    const maskPart = password && password.length > 4 ? password: config.auth.mask;
    return config.auth.mask + maskPart.toUpperCase().substr(4);
};

const generateToken = (user, password) => {
    return jwt.sign({
        'user': user,
        'amask': maskPassword(password) 
    }, config.auth.secret, {
        expiresIn: 1800
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
                fullName: user.fullName,
                refreshToken: user.refreshToken.token
            });
    }});
});

router.route('/facebook')
    .post(passport.authenticate('facebook-token', {session: false}), function(req, res) {
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
                fullName: user.fullName,
                refreshToken: user.refreshToken.token
            });
        }
    });
});

//TODO: consider prohibit multiple calls to this api
router.post('/token', (req, res, next) => {
    if(req.body.user && req.body.refreshToken) {
        User.findOne({ email: req.body.user })
        .exec(function (err, user) {
            if(err) {
                return next(error);
            } else if(!user) {
                return res.send(400, 'Not valid user');
            } else if (user.refreshToken.token !== req.body.refreshToken || user.refreshToken.expires > new Date()) {
                return res.send(401, 'Not valid token');
            } else {
                return res.json({ 
                    token: generateToken(user.email, user.password)
                });
            }
        })
    } else {
        const err = new Error('Refresh token is not specified');
        err.status = 400;
        next(err);
    }
});

module.exports = router;