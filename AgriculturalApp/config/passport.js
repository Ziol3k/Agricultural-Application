// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { User } = require('../models'); 

module.exports = function () {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return done(null, false, { message: 'Nieprawidłowa nazwa użytkownika' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return done(null, false, { message: 'Nieprawidłowe hasło' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Serializacja i deserializacja
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
