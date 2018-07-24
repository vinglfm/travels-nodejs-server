const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, config.auth.secret, function(err, decoded) {
            if(err) {
                return next(err);
            } else {
                next();
            }
        });    
    } else {
      const err = new Error('Access token is not specified');
      err.status = 400;
      return next(err);
    }
};