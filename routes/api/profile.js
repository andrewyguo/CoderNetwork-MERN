const express = require('express'); 
const router = express.Router(); 
const auth = require('../../middleware/auth'); 
const { check, validationResult} = require('express-validator'); 

const User = require('../../models/User'); 
const Profile = require('../../models/Profile'); 

// @route  GET api/profile/me
// @desc   Get User Profile  
// @access Private 
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); 

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user.' }); 
    } else {
      return res.json(profile); 
    }
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// @route  POST api/profile
// @desc   Create or Update User Profile 
// @access Private 
router.post('/', 
  [ 
    auth, 
    [
      check('status', 'Status is Required.').notEmpty(), 
      check('skills', 'Skills are Required.').notEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    console.log(req.body); 
    // Create Profile  
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    console.log(profileFields.skills); 
    // Social Fields 
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id }); 

      if(profile) { // Profile Exists 
        // Update Profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, 
          { $set: profileFields }, 
          { new: true }
        ); 
        res.json(profile); 
      } else { 
        // Create Profile 
        profile = new Profile(profileFields); 

        await profile.save(); 
        res.json(profile); 
      }
    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
  }
); 

// @route  GET api/profile
// @desc   Get All Profiles  
// @access Public 
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']); 
    res.json(profiles); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 


// @route  GET api/profile/user/:user_id
// @desc   Get Profile by ID  
// @access Public 
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']); 
    
    if(!profile) {
      res.status(400).json({ msg: "There is no profile for this user. "}); 
    } else {
      res.json(profile); 
    }
  } catch (error) {
    console.error(error.message); 
    if(error.kind == 'ObjectId') {
      res.status(400).json({ msg: "There is no profile for this user. "}); 
    }
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// @route  DELETE api/profile
// @desc   Delete Profile   
// @access Private 
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove user posts 
    // Remove profile and user 
    await Profile.findOneAndRemove({ user: req.user.id }); 
    await User.findOneAndRemove({ _id: req.user.id }); 

    res.json({ msg: "User Removed" }); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 
module.exports = router; 