const router = require('express').Router();
const User = require('../model/user');

router.post('/', (req, res) => {
    User.findOneAndUpdate({email: req.body.email}, {$set: {refreshToken: {}}}, function(err, user) {
        if(err) {
            return next(err);
        } else if(!user) {
            return res.status(400).json('Not valid user');
        } else {
            return res.json('Logged out');
        }
    });
});

module.exports = router;