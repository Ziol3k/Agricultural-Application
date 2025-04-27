const passport = require("passport");

// Renderowanie strony logowania
exports.renderLoginPage = (req, res) => res.render("login");

// Obsługa logowania z wykorzystaniem strategii "local"
exports.handleLogin = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
});

// Przekierowanie po pomyślnym logowaniu, zależnie od roli użytkownika
exports.postLoginRedirect = (req, res) => {
  if (req.user?.role === "admin") return res.redirect("/admin");
  if (req.user?.role === "user") return res.redirect("/user");
  res.redirect("/login");
};

// Obsługa wylogowania użytkownika
exports.logout = (req, res, next) => {
  req.logout((err) => (err ? next(err) : res.redirect("/")));
};
