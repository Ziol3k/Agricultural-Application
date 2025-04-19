const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isUser } = require('../middleware/authMiddleware'); 

router.get('/', isUser, userController.userDashboard);

router.get('/reservations', isUser, userController.showUserReservations);

router.post('/reservations', isUser, userController.createUserReservation);

router.post('/reservations/delete/:id', isUser, userController.deleteUserReservation);

module.exports = router;
