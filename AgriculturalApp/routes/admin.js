const express = require('express');
const router = express.Router();
const uploadMachineImage = require('../middleware/multerMiddleware');
const { isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/', isAdmin, adminController.getAdminDashboard);
router.get('/machines', isAdmin, adminController.getMachines);
router.post('/machines/add', isAdmin, uploadMachineImage, adminController.addMachine);
//router.post('/machines/delete/:id', isAdmin, adminController.deleteMachine);

router.get('/users', isAdmin, adminController.getUsers);
router.post('/users', isAdmin, adminController.addUser);
router.post('/users/delete/:id', isAdmin, adminController.deleteUser);


module.exports = router;
