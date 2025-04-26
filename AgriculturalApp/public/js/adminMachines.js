document.addEventListener("DOMContentLoaded", () => {
  const addMachineBtn = document.getElementById("add-machine-btn");
  const addMachineModal = document.getElementById("add-machine-modal");
  const cancelAddBtn = document.getElementById("cancel-btn");

  const editMachineModal = document.getElementById("edit-machine-modal");
  const editDeleteBtn = document.getElementById("edit-delete-btn");
  const editForm = document.getElementById("edit-machine-form");
  const editImageInput = document.getElementById("edit-image");
  const editImagePreview = document.getElementById("edit-image-preview");

  // Obsługa dodawania nowej maszyny
  if (addMachineBtn && addMachineModal && cancelAddBtn) {
    addMachineBtn.addEventListener("click", () => {
      addMachineModal.classList.remove("hidden");
    });

    cancelAddBtn.addEventListener("click", () => {
      addMachineModal.classList.add("hidden");
    });

    addMachineModal.addEventListener("click", (event) => {
      if (event.target === addMachineModal) {
        addMachineModal.classList.add("hidden");
      }
    });
  }

  // Obsługa edycji istniejącej maszyny
  document.querySelectorAll(".machine-item").forEach((machine) => {
    machine.addEventListener("click", async () => {
      const machineId = machine.dataset.id;

      if (!machineId) {
        console.error("Nie znaleziono ID maszyny.");
        alert("Nie znaleziono ID maszyny.");
        return;
      }

      try {
        const response = await fetch(`/admin/machines/${machineId}`);
        if (!response.ok) {
          throw new Error("Błąd pobierania danych maszyny");
        }
        const data = await response.json();

        // Wypełnij dane w formularzu edycji
        document.getElementById("edit-machine-name").value = data.name;
        document.getElementById("edit-machine-description").value = data.description;
        document.getElementById("edit-machine-form").action = `/admin/machines/${machineId}/edit`;

        // Ustaw podgląd obecnego zdjęcia maszyny
        if (editImagePreview) {
          editImagePreview.src = data.image_url || "";
          editImagePreview.classList.remove("hidden");
        }

        // Obsługa usuwania maszyny
        editDeleteBtn.onclick = async () => {
          const confirmDelete = confirm("Czy na pewno chcesz usunąć tę maszynę?");
          if (confirmDelete) {
            try {
              const deleteResponse = await fetch(`/admin/machines/${machineId}/delete`, { method: "POST" });
              if (!deleteResponse.ok) {
                throw new Error("Błąd podczas usuwania maszyny");
              }
              location.reload(); // Odśwież stronę po usunięciu
            } catch (deleteError) {
              console.error("Błąd podczas usuwania maszyny:", deleteError);
              alert("Nie udało się usunąć maszyny.");
            }
          }
        };

        // Wyświetl modal edycji
        editMachineModal.classList.remove("hidden");
      } catch (error) {
        console.error("Błąd podczas pobierania danych maszyny:", error);
        alert("Nie udało się pobrać danych maszyny.");
      }
    });
  });

  // Obsługa wyboru nowego zdjęcia
  if (editImageInput) {
    editImageInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        // Uaktualnij podgląd zdjęcia
        const preview = document.getElementById("edit-image-preview");
        preview.src = URL.createObjectURL(file);
        preview.classList.remove("hidden");
      }
    });
  }

  // Zamknięcie modalu edycji
  if (editMachineModal) {
    editMachineModal.addEventListener("click", (event) => {
      if (event.target === editMachineModal) {
        editMachineModal.classList.add("hidden");
      }
    });
  }
});
