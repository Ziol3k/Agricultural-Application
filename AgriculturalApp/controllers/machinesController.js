const { Machine } = require('../models'); // Importujemy model Machine

// Wyświetlanie wszystkich maszyn
const showMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.render('machines', { machines });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

// Wyświetlanie szczegółów jednej maszyny
const showMachineDetails = async (req, res) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) {
      return res.status(404).send("Maszyna nie została znaleziona");
    }
    res.render('machine', { machine });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

module.exports = {
  showMachines,
  showMachineDetails
};
