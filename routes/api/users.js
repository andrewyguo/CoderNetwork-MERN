const express = require('express'); 
const router = express.Router(); 
const { check, validationResult} = require('express-validator/check'); 
const User = require('../../models/User'); 
const gravatar = require('gravatar'); 
const bcrypt = require('bcryptjs'); 

// @route  GET api/users
// @desc   Testing Route 
// @access Public 
router.get('/', (req, res) => res.send('User Route')); 

// @route  POST api/users
// @desc   Register New User  
// @access Public 
router.post('/',  
  [
    check('name', 'Name is required').notEmpty(), 
    check('email', 'Please Include a valid Email').isEmail(), 
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()){ 
      return res.status(400).json({ errors: errors.array() }); 
    } 
    const { name, email, password } = req.body; 

    try {
      // Check if User Exists 
      let user = await User.findOne({ email }); 

      if(user) {
        return res.status(400).json({ errors: [{ msg: 'User Already Exists' }]}); 
      }
      // Get Gravatar of User 
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size of avatar 
        r: 'pg', // Rating 
        d: 'mm' // Default avatar 
      }); 
      user = new User({
        name, 
        email, 
        avatar, 
        password
      }); 
      // Encrypt Password 
      const salt = await bcrypt.genSalt(10); 
      user.password = await bcrypt.hash(password, salt); 
      
      await user.save(); 
      // Return jsonwebtoken 
      res.send('User Registered')
    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
}); 

module.exports = router; 