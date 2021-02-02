const express = require('express'); 
const router = express.Router(); 
const auth = require('../../middleware/auth'); 
const { check, validationResult} = require('express-validator'); 
const request = require('request'); 
const config = require('config'); 

// Models 
const User = require('../../models/User'); 
const Profile = require('../../models/Profile'); 
const Post = require('../../models/Post'); 

/// *** Posts *** 
// @route  POST api/posts
// @desc   Create Post  
// @access Private 
router.post('/', 
  [ 
    auth, 
    [
      check('text', 'Text is Required.').notEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
    
      const newPost = new Post({
        text: req.body.text, 
        name: user.name, 
        avatar: user.avatar, 
        user: req.user.id
      }); 

      const post = await newPost.save(); 
      res.json(post); 
    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
  }  
); 

// @route  GET api/posts
// @desc   Retreive Posts   
// @access Private 
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // -1: Sort in reverse chronological order 
    res.json(posts); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// @route  GET api/posts/:id
// @desc   Retreive Post by ID  
// @access Private 
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);  
    
    if(!post) {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }
    res.json(post);
  } catch (error) {
    if(error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// @route  DELETE api/posts/:id
// @desc   Delete Post by ID  
// @access Private 
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);  
    
    if(!post) {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }

    // Authenticate User 
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this post. ' }); 
    }
    await post.remove(); 
    res.json({ msg: 'Post removed. ' });
  } catch (error) {
    if(error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// *** Likes *** 
// @route  PUT api/posts/like/:id
// @desc   Like Post by ID  
// @access Private 
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);  
    if(!post) {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }
    // Check if User has liked post already 
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post has already been liked.' }); 
    }
    post.likes.unshift({ user: req.user.id }); 
    
    await post.save(); 
    res.json(post.likes);
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// @route  PUT api/posts/unlike/:id
// @desc   Unlike Post by ID  
// @access Private 
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);  
    if(!post) {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }
    // Check if User has not liked post 
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked.' }); 
    }
    // Get Remove Index 
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id); 
    post.likes.splice(removeIndex, 1); 
    
    await post.save(); 
    res.json(post.likes);
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

// @route  POST api/posts/comment/:id
// @desc   Create Comment on Post   
// @access Private 
router.post('/comment/:id', 
  [ 
    auth, 
    [
      check('text', 'Text is Required.').notEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id); 
      
      const newComment = {
        text: req.body.text, 
        name: user.name, 
        avatar: user.avatar, 
        user: req.user.id
      }; 
      // Prepend comment on post
      post.comments.unshift(newComment);  

      await post.save(); 
      res.json(post.comments); 
    } catch (error) {
      console.error(error.message); 
      res.status(500).send(`Server Error: ${error.message}`); 
    }
  }  
); 

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete Comment on Post   
// @access Private 
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); 
    
    // Check if post exists 
    if(!post) {
      return res.status(404).json({ msg: 'Error. Post not found. '}); 
    }
    
    console.log(post.comments)
    console.log(req.params.comment_id)
    // Pull Out Comment 
    const comment = post.comments.find(comment => comment._id.toString().trim() == req.params.comment_id.toString().trim()); 

    // Ensure existence of comment 
    if(!comment) {
      return res.status(404).json({ msg: 'Comment does not exist. ' }); 
    }
  
    // Authenticate User 
    if(comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this comment.' }); 
    }
    // Get Remove Index and Splice 
    const removeIndex = post.comments.map(c => c.user.toString()).indexOf(req.user.id); 
    post.comments.splice(removeIndex, 1); 

    await post.save(); 
    res.json(post.comments); 
  } catch (error) {
    console.error(error.message); 
    res.status(500).send(`Server Error: ${error.message}`); 
  }
}); 

module.exports = router; 