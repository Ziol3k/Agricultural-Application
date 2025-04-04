const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();


const { sequelize, User, Machine, Reservation } = require('./models');

// Inicjalizacja aplikacji
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Sesje
app.use(session({
    secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Strategie logowania
passport.use(new LocalStrategy(async (username, password, done) => {
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

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routing
const machineRoutes = require('./routes/machines');
const reservationRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/', authRoutes);
app.use('/machines', machineRoutes);
app.use('/reservations', reservationRoutes);
app.use('/user', userRoutes);

// Strona główna
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Uruchomienie serwera
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚜 Serwer działa na http://localhost:${PORT}`);
  });
});
