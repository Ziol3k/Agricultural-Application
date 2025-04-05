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
const userRoutes = require('./routes/user');


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
app.use(passport.session()); 

// Routing
app.use('/', authRoutes);  
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);


// Strona główna - przekierowanie na podstawie stanu zalogowania
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return res.redirect('/admin'); 
    } else {
      return res.redirect('/user');  
    }
  }
  res.redirect('/login'); 
});

sequelize.sync({ force: false }).then(async () => {
  await initializeUsers(); 
  app.listen(PORT, () => {
    console.log(`🚜 Serwer działa na http://localhost:${PORT}`);
  });
});
