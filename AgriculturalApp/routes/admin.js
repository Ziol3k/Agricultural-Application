// routes/admin.js
const express = require('express');
const router = express.Router();
const uploadMachineImage = require('../middleware/multerMiddleware');
const { isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/', isAdmin, adminController.getAdminDashboard);
//router.get('/reservations', isAdmin, adminController.getReservations);
router.post('/reservations/delete', isAdmin, adminController.deleteReservation);

router.get('/machines', isAdmin, adminController.getMachines);
router.post('/machines/add', isAdmin, uploadMachineImage, adminController.addMachine);
router.get('/machines/:id', isAdmin, adminController.getMachineDetails);
router.post('/machines/:id/edit', isAdmin, uploadMachineImage, adminController.editMachine);
router.post('/machines/:id/delete', isAdmin, adminController.deleteMachine);


router.get('/users', isAdmin, adminController.getUsers);
router.post('/users', isAdmin, adminController.addUser);
router.post('/users/edit/:id', isAdmin, adminController.editUser);
router.post('/users/delete/:id', isAdmin, adminController.deleteUser);


module.exports = router;
