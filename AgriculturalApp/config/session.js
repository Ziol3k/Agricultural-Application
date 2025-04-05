// config/session.js
const session = require('express-session');

module.exports = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET, // Użyj tajnego klucza, aby zabezpieczyć sesję
    resave: false,  // Zapobiega zapisywaniu sesji, jeśli nie zostały zmienione
    saveUninitialized: false,  // Nie zapisuj sesji, jeśli nie zostały zmienione
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // W produkcji cookie będzie bezpieczne
      maxAge: 1000 * 60 * 60 * 24 // Maksymalny czas życia sesji (np. 24 godziny)
    }
  }));
};
