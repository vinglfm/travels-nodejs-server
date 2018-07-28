const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();
const authorization = require('./common/authorization');
const authRouter = require('./routes/auth');
const signOutRouter = require('./routes/signOut');
const echoRouter = require('./routes/echo');
require('./database');

app.use(cors({exposedHeaders:['x-auth-token']}));
app.use(bodyParser.json());

app.use('/users/authenticate', authRouter);
app.use('/users/signOut', authorization, signOutRouter);
app.use('/echo', authorization, echoRouter);

app.use(function(error, req, res, next) {
    let message;
    if (process.env.NODE_ENV == 'development') {
        message = error.message;
    } else {
        message = 'Internal server error. Please, contact support';
    }
    return res.status(500).json({ message });
  });

app.listen(config.port, () => console.log(`Travels server is running on port ${config.port}`))