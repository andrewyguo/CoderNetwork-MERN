const express = require('express'); 
const router = express.Router(); 
const auth = require('../../middleware/auth'); 
const { check, validationResult} = require('express-validator'); 
const request = require('request'); 
const config = require('config'); 

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

// *** Experiences *** 
// @route  PUT api/profile/experience
// @desc   Add Experience to Profile   
// @access Private 
router.put('/experience', 
  [
    auth, 
    [
      check('title', 'Title is required. ').notEmpty(), 
      check('company', 'Company is required. ').notEmpty(), 
      check('from', 'From Date is required. ').notEmpty(), 
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }  
    const {
      title, 
      company, 
      location, 
      from, 
      to, 
      current, 
      description
    } = req.body; 

    const newExp = {
      title, 
      company, 
      location, 
      from, 
      to, 
      current, 
      description
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id }); 

      profile.experience.unshift(newExp);
      
      await profile.save(); 
      res.json(profile); 
    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
  }
); 

// @route  DELETE api/profile/experience
// @desc   Delete Experience from Profile   
// @access Private 
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // Remove experience
    const profile = await Profile.findOne({ user: req.user.id }); 

    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id); 

    profile.experience.splice(removeIndex, 1); 

    await profile.save(); 
    res.json({ msg: "Experience Removed" }); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// *** Education *** 
// @route  PUT api/profile/education
// @desc   Add Education to Profile   
// @access Private 
router.put('/education', 
  [
    auth, 
    [
      check('school', 'School is required. ').notEmpty(), 
      check('degree', 'Degree is required. ').notEmpty(), 
      check('fieldofstudy', 'Field of Study required.').notEmpty(), 
      check('from', 'From Date is required.').notEmpty() 
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }  
    const {
      school, 
      degree, 
      fieldofstudy, 
      from, 
      to, 
      current, 
      description
    } = req.body; 

    const newEdu = {
      school, 
      degree, 
      fieldofstudy, 
      from, 
      to, 
      current, 
      description
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id }); 

      profile.education.unshift(newEdu);
      
      await profile.save(); 
      res.json(profile); 
    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
  }
); 

// @route  DELETE api/profile/education
// @desc   Delete Education from Profile   
// @access Private 
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // Remove education
    const profile = await Profile.findOne({ user: req.user.id }); 

    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.edu_id); 

    profile.experience.splice(removeIndex, 1); 

    await profile.save(); 
    res.json({ msg: "Education Removed" }); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// *** GitHub ***
// @route  GET api/profile/github/:username
// @desc   Get Repos from GitHub
// @access Public 
router.get('/github/:username', (req, res) => {
  try {
    const options = { 
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`, 
      method: 'GET', 
      headers: { 'user-agent': 'node.js' }
    }; 
    request(options, (err, response, body) => {
      if(err) console.log(err); 

      if(response.statusCode !== 200) {
        res.status(404).json({ msg: 'No GitHub profile found.' }); 
      }
      res.json(JSON.parse(body)); 
    }); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

module.exports = router; 