const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Main page');
});

app.post('/users/authenticate', (req, res) => {
    res.json({ 
        user: 'New',
        token: 5,
        firstName: 'And',
        lastName: 'mescx'
      });
});

app.listen(4000, () => console.log('Example app listening on port 4000!'))