const dev = require('./config.development');
const prod = require('./config.production');

let env;
if (process.env.NODE_ENV === 'production') {
        env = prod;
} else {
        env = dev;
}

module.exports = env;