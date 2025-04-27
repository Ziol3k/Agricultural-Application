document.addEventListener("DOMContentLoaded", async () => {
  const machineItems = document.querySelectorAll(".machine-item");
  const reservationModal = document.getElementById("reservation-modal");
  const cancelReservationBtn = document.getElementById(
    "cancel-reservation-btn"
  );

  let reservedDates = [];

  async function fetchReservedDates(machineId) {
    try {
      const response = await fetch(`/user/reservations/${machineId}`);
      if (!response.ok) {
        throw new Error(
          `Błąd pobierania dat: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.reservedDates || [];
    } catch (error) {
      console.error("Błąd pobierania dat:", error);
      return [];
    }
  }

  machineItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const machineId = item.dataset.id;
      if (!machineId) return;

      document.getElementById("res-machine-id").value = machineId;

      reservedDates = await fetchReservedDates(machineId);

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

  const startDatePicker = flatpickr("#res-start-date", {
    dateFormat: "Y-m-d",
    minDate: tomorrow,
    maxDate: maxDate,
    inline: false,
    clickOpens: true,
    defaultHour: 12,
    static: true,
    disable: reservedDates,
    onChange: function (selectedDates, dateStr) {
      endDatePicker.set("minDate", dateStr);
    },
  });

  const endDatePicker = flatpickr("#res-end-date", {
    dateFormat: "Y-m-d",
    minDate: tomorrow,
    maxDate: maxDate,
    inline: false,
    clickOpens: true,
    defaultHour: 12,
    static: true,
    disable: reservedDates,
  });
});
