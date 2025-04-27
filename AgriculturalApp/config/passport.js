const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = function () {
  // Konfiguracja lokalnej strategii logowania
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ where: { username } });
          if (!user)
            return done(null, false, {
              message: "Nieprawidłowa nazwa użytkownika",
            });
          const valid = await bcrypt.compare(password, user.password);
          if (!valid)
            return done(null, false, { message: "Nieprawidłowe hasło" });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serializacja użytkownika (zapisywanie tylko ID w sesji)
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserializacja użytkownika (odczytywanie danych użytkownika z bazy)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
