const express = require('express'); 
const router = express.Router(); 
const auth = require('../../middleware/auth'); // Authenticates Token 
const User = require('../../models/User'); 
const jwt = require('jsonwebtoken'); 
const config = require('config'); 
const { check, validationResult} = require('express-validator'); 
const bcrypt = require('bcryptjs'); 

// @route  GET api/auth
// @desc   Testing Route 
// @access Protected  
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Returns all except password  
    res.json(user); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send('Server Error'); 
  }
}); 

// @route  POST api/auth
// @desc   Authenticate User & Get Token   
// @access Public 
router.post('/',  
  [
    check('email', 'Please Include a valid Email').isEmail(), 
    check('password', 'Please enter a password').exists()
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()){ 
      return res.status(400).json({ errors: errors.array() }); 
    } 
    const { email, password } = req.body; 

    try {
      // Check if User Exists 
      let user = await User.findOne({ email }); 

      if(!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] }); 
      }
      // Match Password 
      const isMatch = await bcrypt.compare(password, user.password); 

      if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] }); 
      }
      // Return jsonwebtoken 
      const payload = {
        user: {
          id: user.id
        }
      }; 
      jwt.sign(
        payload, 
        config.get('jwtSecret'), 
        { expiresIn: 3600000 }, 
        (err, tkn) => {
          if(err) throw err; 
          res.json({ tkn }); 
        }
      ); 

    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
}); 

module.exports = router; 