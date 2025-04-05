// middleware/authMiddleware.js

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  
  function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.redirect('/login');
  }
  
  function isUser(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'user') {
      return next();
    }
    res.redirect('/login');
  }
  
  module.exports = {
    isAuthenticated,
    isAdmin,
    isUser
  };
  