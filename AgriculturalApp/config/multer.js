const multer = require("multer");
const path = require("path");

// Ustawienia przechowywania pliku
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/machines"),
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `machine-${suffix}${path.extname(file.originalname)}`);
  },
});

// Filtr plików - dozwolone tylko obrazy
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  cb(
    extOk && mimeOk ? null : new Error("Tylko pliki graficzne dozwolone"),
    extOk && mimeOk
  );
};

module.exports = { storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } };
