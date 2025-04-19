document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("add-machine-btn");
    const modal = document.getElementById("add-machine-modal");
    const cancelBtn = document.getElementById("cancel-btn");
  

    if (openBtn && modal && cancelBtn) {
      openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
      });
  
      cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
  
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.add("hidden");
        }
      });
    }
  });
  