function createReservation(price) {
    const showtimeId = sessionStorage.getItem('selectedShowtimeId');  // Hent showtimeId fra sessionStorage
    const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats'));  // Hent stolene fra sessionStorage (array af chair objekter)

    // Tjek om showtimeId er tilgængeligt
    if (!showtimeId) {
        console.error('No showtimeId found in sessionStorage.');
        return;
    }

    // Tjek om der er valgte stole
    if (!selectedSeats || selectedSeats.length === 0) {
        console.error('No seats selected.');
        return;
    }

    // Opret objektet med de data, der skal sendes til backend
    const reservationData = {
        price: price,             // Prisen på reservationen
        showtime: {               // showtime-objektet med kun id
            id: showtimeId
        }
    };

    // Log for at sikre, at dataene er korrekte
    console.log('Sending reservationData:', JSON.stringify(reservationData));

    // Send POST-anmodning for at oprette en reservation
    fetch('https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/api/reservations', {
        method: 'POST',            // HTTP-metode
        headers: {
            'Content-Type': 'application/json',  // Angiver, at vi sender JSON
        },
        body: JSON.stringify(reservationData)    // Konverter reservationData til JSON
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error('Error creating reservation: ' + errorData.message);
                });
            }
            return response.json();  // Konverter responsen til JSON
        })
        .then(data => {
            console.log('Reservation created with ID:', data.id);  // Log det returnerede reservations-ID
            const reservationId = data.id;  // Gem reservations-ID

            // Gem reservations-ID til senere brug i sessionStorage
            sessionStorage.setItem('reservationId', reservationId);

            // Opret bookede stole for hver stol-objekt i selectedSeats
            selectedSeats.forEach(chairObject => {
                createBookedChair(reservationId, chairObject);  // Send hele stol-objektet til createBookedChair
            });

            // Ryd `selectedSeats` når alle bookede stole er oprettet
            sessionStorage.removeItem('selectedSeats');  // Fjerner selectedSeats fra sessionStorage

            // Opdater siden efter at have ryddet `selectedSeats`
           // window.location.reload();  // Genindlæs siden
        })
        .catch(error => {
            console.error('Error:', error);  // Håndter eventuelle fejl
        });
}

function createBookedChair(reservationId, chairObject) {
    const chairId = chairObject.chairId;  // Udpak 'chairId' fra stol-objektet

    const bookedChairData = {
        reservation: { id: reservationId },  // Bruger reservations-ID
        chair: { id: chairId },              // Sender kun chairId
        showtime: { id: sessionStorage.getItem('selectedShowtimeId') }  // Henter showtimeId fra sessionStorage
    };

    console.log('Sending bookedChairData:', JSON.stringify(bookedChairData));

    // Send POST-anmodning for at oprette en booked chair
    fetch('https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/api/bookedchair', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookedChairData)
    })
        .then(response => {
            if (response.ok) {
                alert('Booked chair created successfully!');
               // window.location.reload();
            } else {
                alert('Failed to create booked chair.');
            }
        })
        .catch(error => {
            console.error('Error creating booked chair:', error);
        });
}
