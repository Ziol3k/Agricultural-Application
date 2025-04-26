// middleware/multerMiddleware.js
const multer = require('multer');
const { storage, fileFilter, limits } = require('../config/multer');


// Middleware do uploadu pojedynczego zdjęcia maszyny
const uploadMachineImage = multer({
  storage,
  fileFilter,
  limits
}).single('image'); 

module.exports = uploadMachineImage;
