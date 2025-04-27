// Sprawdza, czy użytkownik jest zalogowany
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Sprawdza, czy użytkownik jest administratorem
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  res.redirect("/login");
}

// Sprawdza, czy użytkownik jest zwykłym użytkownikiem
function isUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "user") return next();
  res.redirect("/login");
}

module.exports = { isAuthenticated, isAdmin, isUser };
