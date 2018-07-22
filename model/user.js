const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
      },
      password: {
        type: String
      },
      facebookProvider: {
        type: {
          id: String,
          token: String
        },
        select: false
      },
      fullName: String
});

UserSchema.pre('save', function (next) {
  const user = this;
  if(user.password) {
    bcrypt.hash(user.password, config.auth.salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if(err) {
        return callback(err);
      } else if(!user) {
        err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
  User.findOne({'facebookProvider.id': profile.id}, function(err, user) {
    if(!user) {
      const newUser = new User({
        email: profile.emails[0].value,
        fullName: profile.displayName,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        }
      });
      newUser.save(function(error, savedUser) {
        if(error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;