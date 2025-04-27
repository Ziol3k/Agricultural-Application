// Główne zależności aplikacji
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();
const { createLogger, transports, format } = require("winston");

// Importy modułów wewnętrznych
const { sequelize } = require("./models");
const sessionConfig = require("./config/session");
const passportConfig = require("./config/passport");
const initializeUsers = require("./init/initializeUsers");
const initializeMachines = require("./init/initializeMachines");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

// Inicjalizacja aplikacji Express
const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracja loggera
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
  ],
});

// Ustawienia silnika widoków
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware do obsługi statycznych plików i żądań
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Konfiguracja sesji i uwierzytelniania
sessionConfig(app);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware: przekazywanie wiadomości flash do widoków
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Definiowanie tras
app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// Główna trasa: przekierowanie użytkownika w zależności od roli
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect(req.user.role === "admin" ? "/admin" : "/user");
  }
  res.redirect("/login");
});

// Synchronizacja bazy danych i uruchomienie serwera
sequelize.sync({ force: false }).then(async () => {
  await initializeUsers();
  await initializeMachines();
  app.listen(PORT, () => {
    logger.info(`Server started at http://localhost:${PORT}`);
  });
});
