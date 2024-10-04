document.addEventListener('DOMContentLoaded', function() {
    const movieSelect = document.getElementById('movieSelect');

    // Hent alle film fra API og vis dem i dropdown
    fetch('http://localhost:8080/movie/getAllMovies')  // Sørg for at erstatte med den rigtige route for at hente alle film fra databasen
        .then(response => {
            if (!response.ok) {
                throw new Error('Netværksfejl: ' + response.status);
            }
            return response.json();
        })
        .then(movies => {
            console.log('Filmliste hentet:', movies);  // Log filmene for at se, om de bliver hentet korrekt
            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.id;  // Brug movie.id som værdi for at forbinde showtime med filmen
                option.textContent = movie.title;  // Vis kun titlen i dropdown
                movieSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Fejl ved hentning af film:', error);  // Log fejlen
            alert('Der opstod en fejl ved indlæsning af filmene. Tjek konsollen for detaljer.');
        });

    // Håndtering af showtime-formular indsendelse
    document.getElementById('add-showtime-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedMovieID = movieSelect.value;  // Hent den valgte filmens ID
        const movieDate = document.getElementById('movieDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const price = document.getElementById('price').value;

        // Simpel validering
        if (!selectedMovieID || !movieDate || !startTime || !endTime || !price) {
            alert('Alle felter skal udfyldes.');
            return;
        }

        // Opret et showtime-objekt med movieID
        const newShowtime = {
            movieID: selectedMovieID,  // Send filmens ID sammen med showtime-data
            movieDate: movieDate,
            startTime: startTime,
            endTime: endTime,
            price: parseFloat(price)
        };

        // Send showtime-data til backend
        fetch('/api/showtimes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShowtime)
        })
            .then(response => response.json())
            .then(data => {
                alert('Showtime er oprettet!');
                console.log('Oprettet showtime:', data);
            })
            .catch(error => console.error('Fejl ved oprettelse af showtime:', error));
    });
});