let selectedSeats = []; // Holder styr på valgte sæder

async function generateSeats(theaterType) {
    const seatContainer = document.querySelector(`#${theaterType} .seat-container`);
    seatContainer.innerHTML = ''; // Tøm containeren først

    const theaterId = theaterType === 'small-theater' ? 1 : 2;

    const chairResponse = await fetch(`http://localhost:8080/chairs/theater/${theaterId}`);
    const chairs = await response.json();

    const showtimeId = 2;

    chairs.forEach(chair => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.dataset.chairId = chair.id;
        seatElement.dataset.row = chair.rowNr;
        seatElement.dataset.seat = chair.chairNr;

        // Opdater tilgængelighed baseret på backend
        if (chair.available) {
            seatElement.classList.add('available');
        } else {
            seatElement.classList.add('unavailable');
        }

        seatContainer.appendChild(seatElement);
    });
}

generateSeats('small-theater');
generateSeats('large-theater');

// Håndtering af sædereservationer med max seats begrænsning
document.addEventListener("click", async function(event) {
    const maxSeats = parseInt(document.getElementById("ticket-count").value);

    if (event.target.classList.contains("available")) {
        if (selectedSeats.length < maxSeats) {
            const chairId = event.target.dataset.chairId;
            const response = await fetch(`http://localhost:8080/chairs/${chairId}/reserve`, { method: "PUT" });

            if (response.ok) {
                event.target.classList.remove("available");
                event.target.classList.add("unavailable");
                selectedSeats.push(chairId); // Tilføj sæde til valgte sæder
            } else {
                alert("Fejl ved reservation");
            }
        } else {
            alert(`Du har allerede valgt ${maxSeats} sæder`);
        }
    } else if (event.target.classList.contains("unavailable") && selectedSeats.includes(event.target.dataset.chairId)) {
        event.target.classList.remove("unavailable");
        event.target.classList.add("available");
        selectedSeats = selectedSeats.filter(id => id !== event.target.dataset.chairId);
    }
});

function reserveSeats() {
    const maxSeats = parseInt(document.getElementById("ticket-count").value);

    if (selectedSeats.length === maxSeats) {
        alert(`Du har reserveret ${maxSeats} sæde(r)!`);
        // Eventuelt send en bekræftelse til backend her eller vis en besked
    } else {
        alert(`Vælg venligst præcis ${maxSeats} sæde(r) før du reserverer.`);
    }
}
