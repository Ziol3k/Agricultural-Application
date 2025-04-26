document.addEventListener("DOMContentLoaded", () => {
    // Elementy dla modalu dodawania użytkownika
    const addUserBtn = document.getElementById("add-user-btn");
    const addUserModal = document.getElementById("add-user-modal");
    const cancelAddUserBtn = document.getElementById("cancel-add-user-btn");
    const generatePasswordBtn = document.getElementById("generate-password-btn");
    const newUserPasswordInput = document.getElementById("new-user-password");
  
    // Wyświetlanie modalu dodawania
    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => {
        addUserModal.classList.remove("hidden");
      });
    }
    
    // Funkcja generowania losowego hasła
    function generateRandomPassword(length = 10) {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    }
    
    // Obsługa generowania hasła przy tworzeniu użytkownika
    if (generatePasswordBtn && newUserPasswordInput) {
      generatePasswordBtn.addEventListener("click", () => {
        newUserPasswordInput.value = generateRandomPassword();
      });
    }
    
    // Obsługa przycisków przełączających widoczność hasła (dla obu modali)
    document.querySelectorAll('.toggle-password').forEach(function(toggleBtn){
      toggleBtn.addEventListener('click', function(){
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            this.textContent = '🙈'; // Ikonka "ukryj"
          } else {
            input.type = 'password';
            this.textContent = '👁';
          }
        }
      });
    });
    
    // Elementy dla modalu edycji użytkownika
    const editUserModal = document.getElementById("edit-user-modal");
    const cancelEditUserBtn = document.getElementById("cancel-edit-user-btn");
    const editGeneratePasswordBtn = document.getElementById("edit-generate-password-btn");
    const editUserPasswordInput = document.getElementById("edit-user-password");
    const deleteUserBtn = document.getElementById("delete-user-btn");
    
    // Obsługa kliknięcia w wiersz tabeli (bez przycisków akcji) – otwiera modal edycji
    document.querySelectorAll(".user-item").forEach((row) => {
      row.addEventListener("click", () => {
        const userId = row.dataset.id;
        if (!userId) return;
  
        // Pobieranie danych z komórek tabeli
        const firstName = row.querySelector(".user-firstName").textContent.trim();
        const lastName = row.querySelector(".user-lastName").textContent.trim();
        const username = row.querySelector(".user-username").textContent.trim();
        const role = row.querySelector(".user-role").textContent.trim();
  
        // Wypełnienie formularza edycji
        document.getElementById("edit-user-firstName").value = firstName;
        document.getElementById("edit-user-lastName").value = lastName;
        document.getElementById("edit-user-username").value = username;
        document.getElementById("edit-user-role").value = role;
        document.getElementById("edit-user-password").value = ""; // pozostaw puste, jeśli nie zmieniamy hasła
        document.getElementById("edit-user-form").action = `/admin/users/edit/${userId}`;
  
        // Wyświetl modal edycji
        editUserModal.classList.remove("hidden");
      });
    });
    
    // Obsługa przycisku usuwania w modalnym formularzu edycji
    if (deleteUserBtn) {
      deleteUserBtn.addEventListener("click", async () => {
        // Pobierz adres URL z akcją formularza – zakładamy, że endpoint do edycji ma postać: /admin/users/edit/:id
        // Zmodyfikuj tak, aby usuwanie wysyłało POST do /admin/users/delete/:id
        const formAction = document.getElementById("edit-user-form").action;
        // Załóżmy, że userId jest ostatnim segmentem URL
        const segments = formAction.split('/');
        const userId = segments[segments.length - 1];
        const confirmDelete = confirm("Czy na pewno chcesz usunąć tego użytkownika?");
        if (confirmDelete) {
          try {
            const response = await fetch(`/admin/users/delete/${userId}`, { method: "POST" });
            if (!response.ok) {
              throw new Error("Błąd podczas usuwania użytkownika");
            }
            location.reload();
          } catch (error) {
            console.error(error);
            alert("Nie udało się usunąć użytkownika.");
          }
        }
      });
    }
    
    // Ukrywanie modalu edycji


    if (editUserModal) {
        editUserModal.addEventListener("click", (event) => {
          if (event.target ===editUserModal) {
            editUserModal.classList.add("hidden");
          }
        });
    }
    
    if (addUserModal) {
        addUserModal.addEventListener("click", (event) => {
          if (event.target ===addUserModal) {
            addUserModal.classList.add("hidden");
          }
        });
    }

    // Obsługa przycisku generowania hasła w edycji
    if (editGeneratePasswordBtn && editUserPasswordInput) {
      editGeneratePasswordBtn.addEventListener("click", () => {
        editUserPasswordInput.value = generateRandomPassword();
      });
    }


  });
  