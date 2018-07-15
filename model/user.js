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
  bcrypt.hash(user.password, config.salt, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;