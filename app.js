const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./model/user');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();

mongoose.connect(`mongodb+srv://vinglfm:${config.mongo.password}@travels-yiabu.gcp.mongodb.net/test`);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDb Atlas');
});

app.use(cors());

app.use(bodyParser.json());

app.post('/', (req, res, next) => {
    if(req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (err, user) {
            if (err || !user) {
            err = new Error('Email or password is not correct');
            err.status = 401;
            return next(err);
            } else {
                return res.send('Main page');
            }
        });
    } else {
      const err = new Error('Email or password is not specified');
      err.status = 400;
      return next(err);
    }
});

app.post('/users/authenticate/signIn', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password
    }, function(error, user) {
        if(error) {
            return next(error);
        } else {
            return res.json({ 
                user: user.email,
                token: 5,
                firstName: user.firstName,
                lastName: user.lastName
            });
        }
    });
});

app.post('/users/authenticate/signUp', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, function(error, user) {
        if(error) {
            return next(error);
        } else {
            return res.json({ 
                user: user.email,
                token: 5,
                firstName: user.firstName,
                lastName: user.lastName
            });
        }
    });
});

app.listen(4000, () => console.log('Travels server is running on port 4000!'))