// config/session.js
const session = require('express-session');

module.exports = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,  
    saveUninitialized: false,  
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // !!! Należy zmienić w ostatecznej wersji
      maxAge: 1000 * 60 * 60
    }
  }));
};
