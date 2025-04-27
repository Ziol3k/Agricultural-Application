const { Machine, Reservation } = require("../models");
const { Op } = require("sequelize");

// Wyświetlanie maszyn na stronie głównej użytkownika wraz z dostępnością - dostępność nie działaa, usunięta na frooncie
//TODO usunąć obsługę dostępnośći
exports.getUserHome = async (req, res) => {
  try {
    const machines = await Machine.findAll({
      include: [{ model: Reservation, attributes: ["date"] }],
    });
    const today = new Date(),
      tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const fmt = (d) => d.toISOString().split("T")[0];

    const machinesWithAvailability = machines.map((m) => {
      const dates = m.Reservations.map((r) => fmt(new Date(r.date)))
        .filter((d) => d >= fmt(today))
        .sort();
      let availability = { freeTomorrow: true };
      const tom = fmt(tomorrow);
      if (dates.includes(tom)) {
        availability = { freeTomorrow: false, availableFrom: null };
        let x = new Date(tomorrow);
        while (dates.includes(fmt(x))) x.setDate(x.getDate() + 1);
        availability.availableFrom = fmt(x);
      }
      m.availability = availability;
      return m;
    });

    res.render("user/index", {
      title: "Strona Główna - Maszyny",
      machines: machinesWithAvailability,
    });
  } catch (err) {
    console.error(err);
    res.send(
      "<script>alert('Błąd serwera!');window.location='/user';</script>"
    );
  }
};

// Rezerwowanie maszyny przez użytkownika
exports.makeReservation = async (req, res) => {
  try {
    const { machine_id, start_date, end_date } = req.body;
    if (!machine_id || !start_date || !end_date)
      return res.send(
        "<script>alert('Wszystkie pola wymagane');window.location='/user';</script>"
      );
    const fmt = (d) => new Date(d).toISOString().split("T")[0];
    const today = new Date(),
      tom = new Date(today);
    tom.setDate(today.getDate() + 1);
    const max = new Date(tom);
    max.setMonth(tom.getMonth() + 3);
    const sd = fmt(start_date),
      ed = fmt(end_date),
      toms = fmt(tom),
      maxs = fmt(max);
    if (sd < toms || ed < sd || ed > maxs)
      return res.send(
        "<script>alert('Nieprawidłowe daty');window.location='/user';</script>"
      );

    const reserved = await Reservation.findAll({
      where: { machine_id, date: { [Op.between]: [sd, ed] } },
      attributes: ["date"],
    });
    const reservedList = reserved.map((r) => r.date);
    const dates = [];
    let cur = new Date(sd);
    while (fmt(cur) <= ed) {
      const d = fmt(cur);
      if (reservedList.includes(d))
        return res.send(
          `<script>alert('${d} zajęta');window.location='/user';</script>`
        );
      dates.push(d);
      cur.setDate(cur.getDate() + 1);
    }
    await Promise.all(
      dates.map((d) =>
        Reservation.create({ machine_id, user_id: req.user.id, date: d })
      )
    );
    res.send(
      "<script>alert('Rezerwacja udana');window.location='/user';</script>"
    );
  } catch (err) {
    console.error(err);
    res.send("<script>alert('Błąd');window.location='/user';</script>");
  }
};

// Pobieranie zarezerwowanych dat dla maszyny
exports.getReservedDates = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { start, end } = req.query;
    const where = { machine_id: machineId };
    let resv = await Reservation.findAll({ where, attributes: ["date"] });
    let dates = resv.map((r) => r.date);
    if (start && end) dates = dates.filter((d) => d < start || d > end);
    res.json({ reservedDates: dates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reservedDates: [] });
  }
};

// Pobieranie rezerwacji użytkownika
exports.getUserReservations = async (req, res) => {
  try {
    const all = await Reservation.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Machine, attributes: ["id", "name"] }],
    });
    const grouped = all.reduce((a, r) => {
      a[r.machine_id] = a[r.machine_id] || [];
      a[r.machine_id].push(r.date);
      return a;
    }, {});
    const frames = Object.entries(grouped).flatMap(([mid, dates]) => {
      dates.sort();
      const arr = [];
      let s = dates[0];
      for (let i = 1; i < dates.length; i++) {
        const p = new Date(dates[i - 1]),
          c = new Date(dates[i]);
        if (c - p > 24 * 60 * 60 * 1000) {
          arr.push({ machineId: mid, start_date: s, end_date: dates[i - 1] });
          s = dates[i];
        }
      }
      arr.push({
        machineId: mid,
        start_date: s,
        end_date: dates[dates.length - 1],
      });
      return arr;
    });
    const reservations = await Promise.all(
      frames.map(async (f) => {
        const m = await Machine.findByPk(+f.machineId);
        return { ...f, machine_name: m ? m.name : "Nieznana" };
      })
    );
    res.render("user/reservations", {
      title: "Twoje Rezerwacje",
      reservations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera");
  }
};

// Edycja rezerwacji użytkownika
exports.editReservation = async (req, res) => {
  try {
    const {
      original_start_date,
      original_end_date,
      start_date,
      end_date,
      machine_id,
    } = req.body;
    const today = new Date(),
      max = new Date();
    max.setMonth(max.getMonth() + 3);
    const ns = new Date(start_date),
      ne = new Date(end_date);
    if (ns < today || ne < ns || ne > max)
      return res.status(400).send("Nieprawidłowe daty");
    await Reservation.destroy({
      where: {
        user_id: req.user.id,
        machine_id,
        date: { [Op.between]: [original_start_date, original_end_date] },
      },
    });
    let cur = new Date(start_date);
    while (cur <= ne) {
      await Reservation.create({
        user_id: req.user.id,
        machine_id,
        date: cur.toISOString().split("T")[0],
      });
      cur.setDate(cur.getDate() + 1);
    }
    res.redirect("/user/reservations");
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd edycji");
  }
};

// Usuwanie rezerwacji użytkownika
exports.deleteReservation = async (req, res) => {
  try {
    const { machineId, start, end } = req.query;
    await Reservation.destroy({
      where: {
        user_id: req.user.id,
        machine_id: machineId,
        date: { [Op.between]: [start, end] },
      },
    });
    res.redirect("/user/reservations");
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd usuwania");
  }
};
