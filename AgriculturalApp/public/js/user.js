// public/js/user.js
document.addEventListener("DOMContentLoaded", async () => {
  const machineItems = document.querySelectorAll(".machine-item");
  const reservationModal = document.getElementById("reservation-modal");
  const cancelReservationBtn = document.getElementById("cancel-reservation-btn");

  let reservedDates = [];

  // Pobieranie zajętych dat dla danej maszyny
  async function fetchReservedDates(machineId) {
    try {
      const response = await fetch(`/user/reservations/${machineId}`);
      if (!response.ok) {
        throw new Error(`Błąd pobierania dat: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data.reservedDates || []; // Zwracamy zajęte daty
    } catch (error) {
      console.error("Błąd pobierania dat:", error);
      return [];
    }
  }

  // Obsługa modala rezerwacji
  machineItems.forEach(item => {
    item.addEventListener("click", async () => {
      const machineId = item.dataset.id;
      if (!machineId) return;

      document.getElementById("res-machine-id").value = machineId;

      // Pobranie zajętych dat przed otwarciem modala
      reservedDates = await fetchReservedDates(machineId);

      // Aktualizacja kalendarza z blokowaniem zajętych dat
      startDatePicker.set("disable", reservedDates);
      endDatePicker.set("disable", reservedDates);

      reservationModal.classList.remove("hidden");
    });
  });

  if (cancelReservationBtn) {
    cancelReservationBtn.addEventListener("click", () => {
      reservationModal.classList.add("hidden");
    });
  }

  if (reservationModal) {
    reservationModal.addEventListener("click", (e) => {
      if (e.target === reservationModal) {
        reservationModal.classList.add("hidden");
      }
    });
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const maxDate = new Date(tomorrow);
  maxDate.setMonth(tomorrow.getMonth() + 3);

  // Inicjalizacja Flatpickr dla daty początkowej
  const startDatePicker = flatpickr("#res-start-date", {
    dateFormat: "Y-m-d",
    minDate: tomorrow,
    maxDate: maxDate,
    inline: false,
    clickOpens: true,
    defaultHour: 12,
    static: true,
    disable: reservedDates, // Ustawiamy zajęte daty dynamicznie
    onChange: function(selectedDates, dateStr) {
      endDatePicker.set("minDate", dateStr);
    }
  });

  // Inicjalizacja Flatpickr dla daty końcowej
  const endDatePicker = flatpickr("#res-end-date", {
    dateFormat: "Y-m-d",
    minDate: tomorrow,
    maxDate: maxDate,
    inline: false,
    clickOpens: true,
    defaultHour: 12,
    static: true,
    disable: reservedDates // Ustawiamy zajęte daty dynamicznie
  });

});
