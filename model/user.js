const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token') ;
const config = require('../config');

//TODO: bundle securety info into object
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
      refreshToken: {
        token: String,
        expiredDate: Date
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
      } else {
        user.password = hash;
        user.refreshToken = generateRefreshToken();
        next();
      }
    });
  } else {
    user.refreshToken = generateRefreshToken();
    next();
  }
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email }).exec(function (err, user) {
    
      if(err) {
        return callback(err);
      } else if(!user) {
        err = new Error('User not found');
        err.status = 401;
        return callback(err);
      } else {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
      });
    }
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
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

//TODO: move refresh token logic to sepparate module
function generateRefreshToken() {
  let expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() + 2);
  return {
    token: randtoken.uid(256),
    expires: expiredDate
  };
}

const User = mongoose.model('User', UserSchema);
module.exports = User;