document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("add-machine-btn");
    const modal = document.getElementById("add-machine-modal");
    const cancelBtn = document.getElementById("cancel-btn");
  
    // Jeśli elementy istnieją
    if (openBtn && modal && cancelBtn) {
      // Otwórz modal po kliknięciu w przycisk "Dodaj maszynę"
      openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
      });
  
      // Zamknij modal po kliknięciu w przycisk "Anuluj"
      cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
  
      // Zamknij modal, jeśli klikniesz poza formularz
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.add("hidden");
        }
      });
    }
  });
  