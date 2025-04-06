// config/multer.js
const multer = require('multer');
const path = require('path');

// Konfiguracja miejsca zapisu i nazwy pliku
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/machines');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtrowanie typów plików
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Tylko pliki graficzne są dozwolone'));
  }
};

module.exports = {
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
};
