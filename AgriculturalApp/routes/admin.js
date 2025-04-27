const express = require("express");
const router = express.Router();
const uploadMachineImage = require("../middleware/multerMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// Panel główny administratora
router.get("/", isAdmin, adminController.getAdminDashboard);

// Usuwanie rezerwacji
router.post("/reservations/delete", isAdmin, adminController.deleteReservation);

// Strona z listą maszyn
router.get("/machines", isAdmin, adminController.getMachines);

// Dodawanie nowej maszyny, obsługuje przesyłanie pliku
router.post(
  "/machines/add",
  isAdmin,
  uploadMachineImage,
  adminController.addMachine
);

// Szczegóły maszyny
router.get("/machines/:id", isAdmin, adminController.getMachineDetails);

// Edytowanie szczegółów maszyny, obsługuje przesyłanie pliku
router.post(
  "/machines/:id/edit",
  isAdmin,
  uploadMachineImage,
  adminController.editMachine
);

// Usuwanie maszyny
router.post("/machines/:id/delete", isAdmin, adminController.deleteMachine);

// Strona z listą użytkowników
router.get("/users", isAdmin, adminController.getUsers);

// Dodawanie nowego użytkownika
router.post("/users", isAdmin, adminController.addUser);

// Edytowanie danych użytkownika
router.post("/users/edit/:id", isAdmin, adminController.editUser);

// Usuwanie użytkownika
router.post("/users/delete/:id", isAdmin, adminController.deleteUser);

module.exports = router;
