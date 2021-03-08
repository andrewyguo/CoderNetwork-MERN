const jwt = require('jsonwebtoken'); 
const config = require('config'); 

module.exports = function(req, res, next) {
  // Get Token from Header 
  const token = req.header('x-auth-token');

  // Check if token exists 
  if(!token) {
    return res.status(401).json({ msg: 'No token, authorization denied. ' }); 
  }
  // Verify Token 
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); 

    req.user = decoded.user; // Set user to be the decoded token 
    next(); 
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid, authorization denied.' }); 
  }
}