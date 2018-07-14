const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Main page');
});

app.post('/users/authenticate/signIn', (req, res) => {
    res.json({ 
        user: req.body.userName,
        token: 5,
        firstName: 'And',
        lastName: 'mescx'
      });
});

app.post('/users/authenticate/signUp', (req, res) => {
    res.json({ 
        user: req.body.userName,
        token: 5,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });
});

app.listen(4000, () => console.log('Travels server is running on port 4000!'))