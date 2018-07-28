const router = require('express').Router();
const User = require('../model/user');

router.post('/', (req, res) => {
    User.findOneAndUpdate({email: req.body.email}, {$set: {refreshToken: {}}}, function(err, user) {
        if(err) {
            return next(err);
        } else {
            return res.json('Logged out');
        }
    });
});

module.exports = router;