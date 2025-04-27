// Konfiguracja multer do obsługi przesyłania plików
const multer = require("multer");
const { storage, fileFilter, limits } = require("../config/multer");

module.exports = multer({ storage, fileFilter, limits }).single("image"); 
