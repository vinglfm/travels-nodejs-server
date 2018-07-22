const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../model/user');
const config = require('../config');

module.exports = function() {
    passport.use(new FacebookTokenStrategy({
        clientID: config.auth.facebook.clientId,
        clientSecret: config.auth.facebook.clientSecret
    }, function(accessToken, refreshToken, profile, done) {
        User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
            return done(err, user);
        });
    }));
};