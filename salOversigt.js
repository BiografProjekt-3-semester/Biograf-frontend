// Funktion til at hente showtimes fra backend og generere links til sædeoversigten
async function generateShowtimeLinks() {
    try {
        const response = await fetch('http://localhost:8080/api/showTimes'); // Endpoint til at hente showtimes fra backend
        const showtimes = await response.json();

        const showtimeContainer = document.getElementById('showtime-links-container'); // Element hvor linksene skal placeres
        showtimeContainer.innerHTML = ''; // Ryd containeren for at undgå duplikerede links

        showtimes.forEach(showtime => {
            const showtimeLink = document.createElement('a');
            showtimeLink.href = `seat-selection.html?showtimeId=${showtime.id}`;
            showtimeLink.textContent = `Sal ${showtime.theater.id} - ${showtime.startTime}`;
            showtimeLink.classList.add('showtime-link'); // CSS-klasse til styling af links
            showtimeContainer.appendChild(showtimeLink);
        });
    } catch (error) {
        console.error("Fejl ved hentning af showtimes: ", error);
    }
}

// Kald funktionen for at generere showtime-links, når siden indlæses
generateShowtimeLinks();

// Funktion til at hente showtimeId fra URL'en
function getShowtimeIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('showtimeId');
}

const showtimeId = getShowtimeIdFromUrl(); // Dynamisk showtimeId baseret på brugerens valg
generateSeats(showtimeId);

// Funktion til generering af sæder baseret på showtime ID
async function generateSeats(showtimeId) {
    const theaterType = await getTheaterTypeFromShowtime(showtimeId);
    const seatContainer = document.querySelector(`#${theaterType} .seat-container`);
    seatContainer.innerHTML = ''; // Tøm containeren først

    const theaterId = theaterType === 'small-theater' ? 1 : 2;

    // Hent alle sæder i teatret
    const chairResponse = await fetch(`http://localhost:8080/chairs/theater/${theaterId}`);
    const chairs = await chairResponse.json();

    // Hent alle bookede sæder for showtime
    const bookedChairsResponse = await fetch(`http://localhost:8080/api/bookedchair/showtime/${showtimeId}`);
    const bookedChairs = await bookedChairsResponse.json();
    const bookedChairIds = bookedChairs.map(bookedChair => bookedChair.chair.id);

    chairs.forEach(chair => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.dataset.chairId = chair.id;
        seatElement.dataset.row = chair.rowNr;
        seatElement.dataset.seat = chair.chairNr;

        // Marker sædet som ledigt eller reserveret baseret på de bookede sæder fra backend
        if (bookedChairIds.includes(chair.id)) {
            seatElement.classList.add('unavailable'); // Reserveret sæde
        } else {
            seatElement.classList.add('available'); // Ledigt sæde
        }

        seatElement.addEventListener('click', () => handleSeatSelection(seatElement));
        seatContainer.appendChild(seatElement);
    });
}

// Funktion til at håndtere sædevalg og farver
function handleSeatSelection(seatElement) {
    const maxSeats = parseInt(document.getElementById("ticket-count").value);

    if (seatElement.classList.contains('available') && selectedSeats.length < maxSeats) {
        seatElement.classList.remove('available');
        seatElement.classList.add('selected'); // Markér valgte sæder med orange
        selectedSeats.push(seatElement.dataset.chairId);
    } else if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        selectedSeats = selectedSeats.filter(id => id !== seatElement.dataset.chairId);
    } else if (selectedSeats.length >= maxSeats) {
        alert(`Du kan kun vælge ${maxSeats} sæde(r)`);
    }
}

// Funktion til at hente teater type baseret på showtime ID
async function getTheaterTypeFromShowtime(showtimeId) {
    try {
        const response = await fetch(`http://localhost:8080/api/showTimes/${showtimeId}`);
        const showtime = await response.json();
        return showtime.theater.id === 1 ? 'small-theater' : 'large-theater';
    } catch (error) {
        console.error("Fejl ved hentning af teater type: ", error);
        return 'small-theater'; // Standardværdi
    }
}

// Variabel til at holde styr på valgte sæder
let selectedSeats = [];