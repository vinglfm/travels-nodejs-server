const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./model/user');
const app = express();
const authRouter = require('./routes/auth');
const echoRouter = require('./routes/echo');

const authorization = (req, res, next) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
    console.log(login, password);
    if(login && password) {
        User.authenticate(login, password, function (err, user) {
            if (err || !user) {
            err = new Error('Email or password is not correct');
            err.status = 401;
            return next(err);
            } else {
                return next();
            }
        });
    } else {
      const err = new Error('Email or password is not specified');
      err.status = 400;
      return next(err);
    }
};

mongoose.connect(`mongodb+srv://vinglfm:${config.mongo.password}@travels-yiabu.gcp.mongodb.net/travels`);
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