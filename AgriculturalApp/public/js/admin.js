document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-reservation-btn');
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const userId = event.target.getAttribute('data-user-id');
        const machineId = event.target.getAttribute('data-machine-id');
        const startDate = event.target.getAttribute('data-start-date').split('T')[0];  // Zbieramy tylko część daty (bez godzin)
        const endDate = event.target.getAttribute('data-end-date').split('T')[0];  // Zbieramy tylko część daty (bez godzin)
        const reservationId = event.target.getAttribute('data-id'); // Zbieramy ID rezerwacji
  
        console.log('Wysyłam dane:', { reservationId, userId, machineId, startDate, endDate });  // Dodajemy logowanie
  
        const confirmDelete = confirm("Czy na pewno chcesz usunąć tę rezerwację?");
  
        if (confirmDelete) {
          try {
            const response = await fetch(`/admin/reservations/delete`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reservationId, userId, machineId, startDate, endDate }),
            });
  
            if (response.ok) {
              alert("Rezerwacja została usunięta.");
              window.location.reload(); // Odśwież stronę po usunięciu
            } else {
              alert("Wystąpił błąd podczas usuwania rezerwacji.");
            }
          } catch (error) {
            console.error('Błąd podczas usuwania rezerwacji:', error);
            alert("Wystąpił błąd podczas próby usunięcia rezerwacji.");
          }
        }
      });
    });
  });
  