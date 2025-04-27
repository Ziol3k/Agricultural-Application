const { Op } = require("sequelize");
const { User, Machine, Reservation } = require("../models");
const bcrypt = require("bcryptjs");

// Wyświetlenie wszystkich maszyn
exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.render("admin/machines", { title: "Zarządzanie Maszynami", machines });
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd serwera");
  }
};

// Dodanie nowej maszyny
exports.addMachine = async (req, res) => {
  const { name, description } = req.body;
  const image_url = req.file ? "/images/machines/" + req.file.filename : null;

  try {
    await Machine.create({ name, description, image_url });
    res.redirect("/admin/machines");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas dodawania maszyny");
  }
};

// Szczegóły maszyny
exports.getMachineDetails = async (req, res) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) return res.status(404).send("Maszyna nie znaleziona");
    res.json(machine);
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd serwera");
  }
};

// Edycja maszyny
exports.editMachine = async (req, res) => {
  try {
    const { name, description } = req.body;
    const machine = await Machine.findByPk(req.params.id);
    const image_url = req.file
      ? "/images/machines/" + req.file.filename
      : machine.image_url;
    await Machine.update(
      { name, description, image_url },
      { where: { id: req.params.id } }
    );
    res.redirect("/admin/machines");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas edycji maszyny");
  }
};

// Usuwanie maszyny
exports.deleteMachine = async (req, res) => {
  try {
    await Machine.destroy({ where: { id: req.params.id } });
    res.redirect("/admin/machines");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas usuwania maszyny");
  }
};

// Wyświetlenie wszystkich użytkowników
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render("admin/users", { title: "Zarządzanie Użytkownikami", users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd serwera");
  }
};

// Dodanie nowego użytkownika
exports.addUser = async (req, res) => {
  const { firstName, lastName, username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
    });
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas dodawania użytkownika");
  }
};

// Edycja użytkownika
exports.editUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, username, password, role } = req.body;
  try {
    const updateData = { firstName, lastName, username, role };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await User.update(updateData, { where: { id: userId } });
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas edycji użytkownika");
  }
};

// Usuwanie użytkownika
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas usuwania użytkownika");
  }
};

// Dashboard administratora (rezerwacje)
exports.getAdminDashboard = async (req, res) => {
  try {
    const groupedReservations = await getGroupedReservations();
    const dateRanges = calculateStartAndEndDates(groupedReservations);

    res.render("admin/index", {
      title: "Panel Administratora",
      dateRanges,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

// Grupowanie rezerwacji po użytkowniku i maszynie
async function getGroupedReservations() {
  const reservations = await Reservation.findAll({
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: Machine, attributes: ["id", "name"] },
    ],
    order: [["date", "ASC"]],
  });

  const groupedByUser = {};
  reservations.forEach((reservation) => {
    const uid = reservation.user_id;
    const mid = reservation.machine_id;
    if (!groupedByUser[uid]) groupedByUser[uid] = {};
    if (!groupedByUser[uid][mid]) groupedByUser[uid][mid] = [];
    groupedByUser[uid][mid].push(reservation);
  });
  return groupedByUser;
}

// Obliczanie dat początkowych i końcowych dla rezerwacji
function calculateStartAndEndDates(groupedByUser) {
  const result = [];

  for (const userId in groupedByUser) {
    for (const machineId in groupedByUser[userId]) {
      const recs = groupedByUser[userId][machineId];
      if (!recs.length) continue;

      let startDate = recs[0].date;
      let endDate = recs[0].date;

      for (let i = 1; i < recs.length; i++) {
        const prev = new Date(recs[i - 1].date);
        const curr = new Date(recs[i].date);
        if (prev.getTime() + 24 * 60 * 60 * 1000 === curr.getTime()) {
          endDate = recs[i].date;
        } else {
          result.push(
            makeRange(recs[0], userId, machineId, startDate, endDate)
          );
          startDate = recs[i].date;
          endDate = recs[i].date;
        }
      }
      result.push(makeRange(recs[0], userId, machineId, startDate, endDate));
    }
  }
  return result;
}

// Tworzenie zakresu rezerwacji
function makeRange(sampleRes, userId, machineId, startDate, endDate) {
  return {
    userId: Number(userId),
    machineId: Number(machineId),
    user: {
      id: sampleRes.User.id,
      firstName: sampleRes.User.firstName,
      lastName: sampleRes.User.lastName,
    },
    machineName: sampleRes.Machine.name,
    startDate,
    endDate,
  };
}

// Usuwanie rezerwacji
exports.deleteReservation = async (req, res) => {
  try {
    const { userId, machineId, startDate, endDate } = req.body;
    if (!userId || !machineId || !startDate || !endDate) {
      return res.status(400).json({ message: "Brakuje wymaganych danych." });
    }

    await Reservation.destroy({
      where: {
        user_id: userId,
        machine_id: machineId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.status(200).json({ message: "Rezerwacje zostały usunięte." });
  } catch (error) {
    console.error("Błąd podczas usuwania rezerwacji:", error);
    res.status(500).json({ message: "Błąd podczas usuwania rezerwacji" });
  }
};
