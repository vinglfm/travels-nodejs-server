const router = require('express').Router();

router.get('/', (req, res) => {    
    return res.send('Main page');
});

module.exports = router;