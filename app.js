const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./model/user');
const app = express();
const authRouter = require('./routes/auth');
const echoRouter = require('./routes/echo');

const authorization = (req, res, next) => {
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
      const err = new Error('Token is not specified');
      err.status = 400;
      return next(err);
    }
};

mongoose.connect(`mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.url}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDb Atlas');
});

app.use(cors());
app.use(bodyParser.json());

app.use('/users/authenticate', authRouter);
app.use('/echo', authorization, echoRouter);

app.listen(4000, () => console.log('Travels server is running on port 4000!'))