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
        type: String,
        required: true
      },
      firstName: String,
      lastName: String,
});

UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, config.auth.salt, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
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
}

const User = mongoose.model('User', UserSchema);
module.exports = User;