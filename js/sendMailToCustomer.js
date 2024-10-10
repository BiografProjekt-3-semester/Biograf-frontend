async function fetchReservationAndCustomer() {
    const customerDataID = sessionStorage.getItem('customerDataID');  // Hent showtimeId fra sessionStorage
    const reservationId = sessionStorage.getItem('reservationId');  // Hent showtimeId fra sessionStorage

    if (!customerDataID || !reservationId) {
        console.error('Missing customerId or reservationId in sessionStorage');
        return;
    }

    try {
        // Hent reservationen fra API'et
        const reservationResponse = await fetch(`http://localhost:8080/api/reservations/${reservationId}`);
        if (!reservationResponse.ok) {
            throw new Error('Failed to fetch reservation data');
        }
        const reservation = await reservationResponse.json();


        // Hent kunden fra API'et
        const customerResponse = await fetch(`http://localhost:8080/api/customers/${customerDataID}`);
        if (!customerResponse.ok) {
            throw new Error('Failed to fetch customer data');
        }
        const customer = await customerResponse.json();

        // Opret en besked baseret på reservation og kunde
        const message = `
        Reservation Details:
        - Reservation ID: ${reservation.id}
        - Price: ${reservation.price} DKK
        - Showtime Date: ${reservation.showtime.movieDate}
        - Start Time: ${reservation.showtime.startTime}
        - End Time: ${reservation.showtime.endTime}
        - Movie: ${reservation.showtime.movie.title} (${reservation.showtime.movie.description})
        - Theater: ${reservation.showtime.theater.name}

        Customer Details:
        - Name: ${customer.firstName} ${customer.lastName}
        - Email: ${customer.email}
        - Age: ${customer.age}
        `;

        // Vis beskeden
        alert(message);
        window.location.reload();

    } catch (error) {
        console.error('Error fetching reservation or customer data:', error);
    }
}

