const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        const user = req.body.user || req.query.user;
        jwt.verify(token, config.auth.secret, function(err, decoded) {
            console.log(decoded);
            if(err) {
                return next(err);
            } else if(decoded.user !== user) {
                const err = new Error('Access token is not valid');
                err.status = 400;
                return next(err);
            }else {
                req.token = token;
                next();
            }
        });    
    } else {
      const err = new Error('Access token is not specified');
      err.status = 400;
      return next(err);
    }
};