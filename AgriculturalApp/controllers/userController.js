const { Machine, Reservation } = require('../models');
const { Op } = require('sequelize');

exports.getUserHome = async (req, res) => {
  try {
    const { message } = req.query;
    const machines = await Machine.findAll({
      include: [{ model: Reservation, attributes: ['date'] }]
    });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const machinesWithAvailability = machines.map(machine => {
      const reservations = machine.Reservations
        .map(r => formatDate(new Date(r.date)))
        .filter(date => date >= formatDate(today)) // Uwzględniamy tylko przyszłe rezerwacje
        .sort();

      console.log(`Maszyna: ${machine.name}, Wszystkie rezerwacje:`, reservations);

      const tomorrowStr = formatDate(tomorrow);
      
      let availability = {};
      if (!reservations.length || reservations.every(date => date > tomorrowStr)) {
        availability = { freeTomorrow: true };
      } else {
        let availDate = new Date(tomorrow);
        while (reservations.includes(formatDate(availDate))) {
          availDate.setDate(availDate.getDate() + 1);
        }
        availability = {
          freeTomorrow: false,
          availableFrom: formatDate(availDate)
        };
      }

      machine.availability = availability;
      console.log(`Maszyna: ${machine.name}, Dostępność:`, availability);

      return machine;
    });

    res.render("user/index", {
      title: "Strona Główna - Maszyny",
      machines: machinesWithAvailability,
      message
    });
  } catch (error) {
    console.error(error);
    res.send("<script>alert('Błąd serwera!'); window.location='/user';</script>");
  }
};




exports.makeReservation = async (req, res) => {
  try {
    const { machine_id, start_date, end_date } = req.body;

    if (!machine_id || !start_date || !end_date) {
      return res.send("<script>alert('Wszystkie pola są wymagane!'); window.location='/user';</script>");
    }

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const maxDate = new Date(tomorrow);
    maxDate.setMonth(tomorrow.getMonth() + 3);

    const startDate = formatDate(start_date);
    const endDate = formatDate(end_date);
    const tomorrowStr = formatDate(tomorrow);
    const maxDateStr = formatDate(maxDate);

    if (startDate < tomorrowStr) {
      return res.send("<script>alert('Data początkowa musi być przynajmniej jutrzejsza!'); window.location='/user';</script>");
    }

    if (endDate < startDate) {
      return res.send("<script>alert('Data końcowa nie może być wcześniejsza niż początkowa!'); window.location='/user';</script>");
    }

    if (startDate > maxDateStr || endDate > maxDateStr) {
      return res.send("<script>alert('Maksymalny okres rezerwacji to 3 miesiące w przyszłość!'); window.location='/user';</script>");
    }

    const reservedDates = await Reservation.findAll({
      where: { machine_id: machine_id, date: { [Op.between]: [startDate, endDate] } },
      attributes: ["date"]
    });

    const reservedDateList = reservedDates.map(res => res.date);

    const dates = [];
    let current = new Date(startDate);
    while (formatDate(current) <= endDate) {
      const formattedDate = formatDate(current);
      if (reservedDateList.includes(formattedDate)) {
        return res.send(`<script>alert('Wybrana data ${formattedDate} jest już zajęta!'); window.location='/user';</script>`);
      }
      dates.push(formattedDate);
      current.setDate(current.getDate() + 1);
    }

    const userId = req.user.id;
    await Promise.all(dates.map(async dateStr => {
      await Reservation.create({ machine_id, user_id: userId, date: dateStr });
    }));

    res.send("<script>alert('Rezerwacja została pomyślnie dokonana!'); window.location='/user';</script>");
  } catch (error) {
    console.error(error);
    res.send("<script>alert('Błąd podczas rezerwacji!'); window.location='/user';</script>");
  }
};

// Pobranie zajętych dat dla danej maszyny (ignorując aktualną edytowaną rezerwację)
exports.getReservedDates = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { start, end } = req.query; // Dodajemy oryginalne daty rezerwacji w zapytaniu!

    const where = { machine_id: machineId };

    const reservations = await Reservation.findAll({
      where,
      attributes: ["date"]
    });

    let reservedDates = reservations.map(r => r.date);

    // Jeśli podano zakres start-end, to filtrujemy
    if (start && end) {
      reservedDates = reservedDates.filter(date => {
        const d = new Date(date);
        return d < new Date(start) || d > new Date(end);
      });
    }

    console.log("Zajęte daty dla maszyny:", machineId, reservedDates);

    res.json({ reservedDates });

  } catch (error) {
    console.error("Błąd pobierania rezerwacji:", error);
    res.status(500).json({ reservedDates: [] });
  }
};


exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Machine, attributes: ['id', 'name'] }]
    });

    console.log("Wszystkie rezerwacje użytkownika:", reservations);

    // Pogrupowanie rezerwacji według `machine_id`
    const groupedReservations = reservations.reduce((acc, reservation) => {
      const machineId = reservation.machine_id;
      if (!acc[machineId]) acc[machineId] = [];
      acc[machineId].push(reservation.date);
      return acc;
    }, {});

    // Przetwarzanie grupowanych rezerwacji w przedziały czasowe
    const processedReservations = Object.entries(groupedReservations).map(([machineId, dates]) => {
      const sortedDates = dates.sort(); // Sortujemy daty rosnąco
      const timeFrames = [];
      let startDate = sortedDates[0];

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currentDate = new Date(sortedDates[i]);

        // Jeśli różnica między dniami > 1 dzień, kończymy poprzedni przedział i zaczynamy nowy
        if (currentDate - prevDate > 24 * 60 * 60 * 1000) {
          timeFrames.push({ machineId, start_date: startDate, end_date: sortedDates[i - 1] });
          startDate = sortedDates[i];
        }
      }
      
      // Dodaj ostatni przedział czasowy
      timeFrames.push({ machineId, start_date: startDate, end_date: sortedDates[sortedDates.length - 1] });
      return timeFrames;
    }).flat();

    processedReservations.forEach(res => {
      res.machineId = parseInt(res.machineId, 10);
    });

    console.log("Przetworzone rezerwacje:", processedReservations);



    // Pobieranie nazw maszyn
    const finalReservations = await Promise.all(processedReservations.map(async (res) => {
      const machine = await Machine.findOne({ where: { id: parseInt(res.machineId, 10) }, attributes: ['name'] });
      console.log(`Sprawdzam maszynę o ID: ${res.machineId}, wynik:`, machine);

      return { ...res, machine_name: machine ? machine.name : "Nieznana maszyna" };
    }));    
    console.log("final: ", finalReservations)
    res.render("user/reservations", { title: "Twoje Rezerwacje", reservations: finalReservations });
  } catch (error) {
    console.error("Błąd pobierania rezerwacji:", error);
    res.status(500).send("Błąd serwera");
  }
};


exports.editReservation = async (req, res) => {
  try {
    const { original_start_date, original_end_date, start_date, end_date, machine_id } = req.body;

    console.log("Oryginalne daty rezerwacji:", original_start_date, original_end_date);
    console.log("Nowe daty rezerwacji:", start_date, end_date);

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 3);

    const newStartDate = new Date(start_date);
    const newEndDate = new Date(end_date);
    const originalStartDate = new Date(original_start_date);
    const originalEndDate = new Date(original_end_date);

    if (newStartDate < today || newEndDate < newStartDate || newEndDate > maxDate) {
      return res.status(400).send("Nieprawidłowe daty rezerwacji.");
    }

    // **Usuń tylko dni z pierwotnego zakresu rezerwacji**
    await Reservation.destroy({
      where: {
        user_id: req.user.id,
        machine_id: machine_id,
        date: { [Op.between]: [originalStartDate, originalEndDate] } 
      }
    });

    // **Dodaj nowe dni w ramach nowej rezerwacji**
    let current = new Date(newStartDate);
    while (current <= newEndDate) {
      await Reservation.create({
        user_id: req.user.id,
        machine_id: machine_id,
        date: current.toISOString().split("T")[0]
      });

      current.setDate(current.getDate() + 1);
    }

    res.redirect("/user/reservations");

  } catch (error) {
    console.error("Błąd edycji rezerwacji:", error);
    res.status(500).send("Błąd edycji rezerwacji.");
  }
};


exports.deleteReservation = async (req, res) => {
  try {
    const { machineId, start, end } = req.query;

    if (!machineId || !start || !end) {
      return res.status(400).send("Nieprawidłowe dane usuwanej rezerwacji.");
    }

    console.log("Usuwanie rezerwacji dla maszyny:", machineId);
    console.log("Zakres usuwanej rezerwacji:", start, "do", end);

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      return res.status(400).send("Nieprawidłowe daty rezerwacji.");
    }

    await Reservation.destroy({
      where: {
        user_id: req.user.id,
        machine_id: machineId,
        date: { [Op.between]: [startDate, endDate] }
      }
    });

    res.redirect("/user/reservations");
  } catch (error) {
    console.error("Błąd usuwania rezerwacji:", error);
    res.status(500).send("Błąd usuwania rezerwacji.");
  }
};
