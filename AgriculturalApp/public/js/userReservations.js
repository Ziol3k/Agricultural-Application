document.addEventListener("DOMContentLoaded", async () => {
  const reservationItems = document.querySelectorAll(".reservation-item");
  const editReservationModal = document.getElementById(
    "edit-reservation-modal"
  );
  const deleteReservationBtn = document.getElementById(
    "delete-reservation-btn"
  );
  const editReservationForm = document.getElementById("edit-reservation-form");

  let reservedDates = [];

  async function fetchReservedDates(
    machineId,
    currentStartDate,
    currentEndDate
  ) {
    try {
      console.log("ID maszyny:", machineId);
      const response = await fetch(
        `/user/reservations/${machineId}?start=${currentStartDate}&end=${currentEndDate}`
      );
      if (!response.ok) {
        throw new Error(
          `Błąd pobierania dat: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Dane pobrane z API:", data);

      return data.reservedDates;
    } catch (error) {
      console.error("Błąd pobierania dat:", error);
      return [];
    }
  }

  reservationItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const reservationId = item.dataset.id;
      const machineId = item.dataset.machineId;

      if (!machineId) {
        console.error("Błąd: `machineId` jest `undefined`!");
        return;
      }

      const startDate = item
        .querySelector(".reservation-start")
        .textContent.trim();
      const endDate = item.querySelector(".reservation-end").textContent.trim();
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const threeMonthsLater = new Date(today);
      threeMonthsLater.setMonth(today.getMonth() + 3);

      editReservationForm.action = `/user/reservations/edit`;

      const startDateInput = document.getElementById("res-start-date");
      const endDateInput = document.getElementById("res-end-date");
      startDateInput.value = startDate;
      endDateInput.value = endDate;

      let originalStartDateInput = document.querySelector(
        "input[name='original_start_date']"
      );
      if (!originalStartDateInput) {
        originalStartDateInput = document.createElement("input");
        originalStartDateInput.type = "hidden";
        originalStartDateInput.name = "original_start_date";
        editReservationForm.appendChild(originalStartDateInput);
      }
      originalStartDateInput.value = startDate;

      let originalEndDateInput = document.querySelector(
        "input[name='original_end_date']"
      );
      if (!originalEndDateInput) {
        originalEndDateInput = document.createElement("input");
        originalEndDateInput.type = "hidden";
        originalEndDateInput.name = "original_end_date";
        editReservationForm.appendChild(originalEndDateInput);
      }
      originalEndDateInput.value = endDate;

      let machineIdInput = document.querySelector("input[name='machine_id']");
      if (!machineIdInput) {
        machineIdInput = document.createElement("input");
        machineIdInput.type = "hidden";
        machineIdInput.name = "machine_id";
        editReservationForm.appendChild(machineIdInput);
      }
      machineIdInput.value = machineId;

      deleteReservationBtn.onclick = () => {
        if (confirm("Czy na pewno chcesz usunąć tę rezerwację?")) {
          window.location.href = `/user/reservations/delete?machineId=${machineId}&start=${startDate}&end=${endDate}`;
        }
      };

      reservedDates = await fetchReservedDates(machineId, startDate, endDate);

      const sortedDates = reservedDates.sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const nextReservationStart = sortedDates.find(
        (date) => new Date(date) > new Date(endDate)
      );

      const maxDateEnd = nextReservationStart
        ? new Date(nextReservationStart)
        : threeMonthsLater;
      const maxDateStart = new Date(endDate);

      console.log("Następna rezerwacja rozpoczyna się:", nextReservationStart);
      console.log("Ustawione maxDate dla końca:", maxDateEnd);
      console.log("Ustawione maxDate dla początku:", maxDateStart);

      flatpickr("#res-start-date", {
        dateFormat: "Y-m-d",
        minDate: tomorrow,
        maxDate: maxDateStart,
        disable: reservedDates,
      });

      flatpickr("#res-end-date", {
        dateFormat: "Y-m-d",
        minDate: startDate,
        maxDate: maxDateEnd,
        disable: reservedDates,
      });

      editReservationModal.classList.remove("hidden");
    });
  });

  if (editReservationModal) {
    editReservationModal.addEventListener("click", (e) => {
      if (e.target === editReservationModal) {
        editReservationModal.classList.add("hidden");
      }
    });
  }
});
