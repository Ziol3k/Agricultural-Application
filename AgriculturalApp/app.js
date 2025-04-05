const express = require('express');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const sessionConfig = require('./config/session');
const passportConfig = require('./config/passport');
const initializeUsers = require('./init/initializeUsers');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Inicjalizacja aplikacji
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Sesje
sessionConfig(app);

// Passport
passportConfig();

// Middleware dla sesji Passport
app.use(passport.initialize());
app.use(passport.session()); // <- Dodaj to tutaj, aby funkcja req.isAuthenticated była dostępna

// Routing
app.use('/', authRoutes);  // Strona logowania (domyślna strona)
app.use('/admin', adminRoutes);

// Strona główna - przekierowanie na podstawie stanu zalogowania
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return res.redirect('/admin');  // Jeśli użytkownik jest adminem, przekieruj do panelu admina
    } else {
      return res.redirect('/user');  // Jeśli użytkownik jest zwykłym użytkownikiem, pozostaje na stronie głównej (lub inne przekierowanie)
    }
  }
  res.redirect('/login');  // Jeśli nie jest zalogowany, przekieruj na stronę logowania
});

sequelize.sync({ force: false }).then(async () => {
  await initializeUsers();  // Inicjalizacja użytkowników
  app.listen(PORT, () => {
    console.log(`🚜 Serwer działa na http://localhost:${PORT}`);
  });
});
