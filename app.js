const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const authorization = require('./common/authorization');
const authRouter = require('./routes/auth');
const echoRouter = require('./routes/echo');

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

app.use(function(error, req, res, next) {
    //TODO: think of not sending code related error to user, at least in production
    res.status(500).json({ message: error.message });
  });

app.listen(config.port, () => console.log(`Travels server is running on port ${config.port}!`))