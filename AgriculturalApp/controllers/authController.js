// controllers/authController.js
const passport = require('passport');

const renderLoginPage = (req, res) => {
  res.render('login');
};

const handleLogin = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
});

const postLoginRedirect = (req, res) => {
  console.log('Zalogowany użytkownik:', req.user);
  if (req.user?.role === 'admin') return res.redirect('/admin');
  if (req.user?.role === 'user') return res.redirect('/user');
  return res.redirect('/login');
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

module.exports = {
  renderLoginPage,
  handleLogin,
  postLoginRedirect,
  logout
};
