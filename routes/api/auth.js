const express = require('express'); 
const router = express.Router(); 

// @route  GET api/auth
// @desc   Testing Route 
// @access Public 
router.get('/', (req, res) => res.send('auth Route')); 

module.exports = router; 