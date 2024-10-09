// Funktion til at hente teater type baseret på showtime ID
async function getTheaterTypeFromShowtime(showtimeId) {
    try {
        const response = await fetch(`http://localhost:8080/api/showTimes/${showtimeId}`);
        const showtime = await response.json();

        // Returner teater typen baseret på showtime's theater ID
        return showtime.theater.id === 1 ? 'small-theater' : 'large-theater';
    } catch (error) {
        console.error("Fejl ved hentning af teater type: ", error);
        return 'small-theater'; // Standardværdi hvis der opstår en fejl
    }
}

// Funktion til generering af sæder baseret på showtime ID
async function generateSeats(showtimeId) {
    // Hent showtimeId fra sessionStorage, hvis det ikke er tilgængeligt som parameter
    if (!showtimeId) {
        showtimeId = sessionStorage.getItem('selectedShowtimeId');
    }

    // Hvis showtimeId stadig er null eller undefined, log en fejl og stop funktionen
    if (!showtimeId) {
        console.error("Showtime ID is missing. Unable to generate seats.");
        return;
    }

    console.log("Generating seats for showtime ID: ", showtimeId);

    const theaterType = await getTheaterTypeFromShowtime(showtimeId);
    const smallTheater = document.getElementById('small-theater');
    const largeTheater = document.getElementById('large-theater');

    // Skjul begge teatre til at begynde med
    smallTheater.style.display = 'none';
    largeTheater.style.display = 'none';

    const seatContainer = theaterType === 'small-theater' ? smallTheater : largeTheater;
    seatContainer.style.display = 'grid';
    seatContainer.innerHTML = '';

    const theaterId = theaterType === 'small-theater' ? 1 : 2;

    try {
        const chairResponse = await fetch(`http://localhost:8080/chairs/theater/${theaterId}`);
        const chairs = await chairResponse.json();
        console.log("Chairs retrieved: ", chairs);

        // Hent alle bookede sæder for showtime
        const bookedChairsResponse = await fetch(`http://localhost:8080/api/bookedchair/showtime/${showtimeId}`);
        const bookedChairs = await bookedChairsResponse.json();
        const bookedChairIds = bookedChairs.map(bookedChair => bookedChair.chair.id);
        console.log("Booked chairs for showtime ID ", showtimeId, ": ", bookedChairIds);

        chairs.forEach(chair => {
            const seatElement = document.createElement('div');
            seatElement.classList.add('seat');
            seatElement.dataset.chairId = chair.id;
            seatElement.dataset.row = chair.rowNr;
            seatElement.dataset.seat = chair.chairNr;
            seatElement.dataset.special = chair.special;

            if (chair.special) {
                seatElement.classList.add('special');
            } else if (bookedChairIds.includes(chair.id)) {
                seatElement.classList.add('unavailable');
            } else {
                seatElement.classList.add('available');
            }

            seatElement.addEventListener('click', () => handleSeatSelection(seatElement));
            seatContainer.appendChild(seatElement);
        });
    } catch (error) {
        console.error("Fejl ved hentning af sæder eller bookede sæder: ", error);
    }
}

// Tilføj handleSeatSelection funktionen her

// Funktion til at håndtere sædevalg og farver
function handleSeatSelection(seatElement) {
    const maxSeats = parseInt(document.getElementById("ticket-count").value);

    if (seatElement.classList.contains('available') || seatElement.classList.contains('special')) {
        if (selectedSeats.length < maxSeats) {
            seatElement.classList.remove('available', 'special');
            seatElement.classList.add('selected'); // Markér valgte sæder med orange
            selectedSeats.push(seatElement.dataset.chairId);
        } else {
            alert(`Du kan kun vælge ${maxSeats} sæde(r)`);
        }
    } else if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        seatElement.classList.add(seatElement.dataset.special === 'true' ? 'special' : 'available');
        selectedSeats = selectedSeats.filter(id => id !== seatElement.dataset.chairId);
    }
}

// Variabel til at holde styr på valgte sæder
let selectedSeats = [];
