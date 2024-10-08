document.addEventListener('DOMContentLoaded', function() {
    const movieSelect = document.getElementById('movieSelect');

    // Hent alle film fra API og vis dem i dropdown
    fetch('http://localhost:8080/movie/getAllMovies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netværksfejl: ' + response.status);
            }
            return response.json();
        })
        .then(movies => {
            console.log('Filmliste hentet:', movies);
            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.id;
                option.textContent = movie.title;
                movieSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Fejl ved hentning af film:', error);
            alert('Der opstod en fejl ved indlæsning af filmene. Tjek konsollen for detaljer.');
        });

    // Håndtering af showtime-formular indsendelse
    document.getElementById('add-showtime-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedMovieID = movieSelect.value;
        const movieDate = document.getElementById('movieDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const price = document.getElementById('price').value;

        if (!selectedMovieID || !movieDate || !startTime || !endTime || !price) {
            alert('Alle felter skal udfyldes.');
            return;
        }

        // Opret et showtime-objekt med movie og theater
        const newShowtime = {
            movieDate: movieDate,
            startTime: startTime,
            endTime: endTime,
            price: parseFloat(price),
            movie: { id: selectedMovieID },
            theater: { id: 1 }  // Du kan gøre det dynamisk, hvis der er flere teatre
        };

        // Send showtime-data til backend
        fetch('/api/showtimes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShowtime)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fejl ved oprettelse af showtime: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                alert('Showtime er oprettet!');
                console.log('Oprettet showtime:', data);
            })
            .catch(error => console.error('Fejl ved oprettelse af showtime:', error));
    });
});