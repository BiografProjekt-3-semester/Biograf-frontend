document.addEventListener('DOMContentLoaded', function() {
    const movieSelect = document.getElementById('movieSelect');
    const theaterSelect = document.getElementById('theaterId');  // Tilføj theaterSelect element

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

    // Hent alle teatre fra API og vis dem i dropdown
    fetch('http://localhost:8080/api/theaters/getTheaters')  // Justér URL til teater-endpointet
        .then(response => {
            if (!response.ok) {
                throw new Error('Netværksfejl: ' + response.status);
            }
            return response.json();
        })
        .then(theaters => {
            console.log('Teaterliste hentet:', theaters);
            theaters.forEach(theater => {
                const option = document.createElement('option');
                option.value = theater.id;
                option.textContent = theater.name;
                theaterSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Fejl ved hentning af teatre:', error);
            alert('Der opstod en fejl ved indlæsning af teatre. Tjek konsollen for detaljer.');
        });

    // Håndtering af showtime-formular indsendelse
    document.getElementById('add-showtime-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedMovieID = movieSelect.value;
        const movieDate = document.getElementById('movieDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const price = document.getElementById('price').value;
        const selectedTheaterID = theaterSelect.value;

        if (!selectedMovieID || !movieDate || !startTime || !endTime || !price || !selectedTheaterID) {
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
            theater: { id: selectedTheaterID }
        };

        // Send showtime-data til backend
        fetch('http://localhost:8080/api/showTimes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShowtime)
        })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Showtime er oprettet!');
                console.log('Oprettet showtime:', data);

                // Luk modal-vinduet
                const modalElement = document.getElementById('addShowtimeModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

                // Nulstil formularen efter success
                document.getElementById('add-showtime-form').reset();
            })
            .catch(error => {
                console.error('Fejl ved oprettelse af showtime:', error);
                alert(error.message);  // Viser fejlen fra backend i en alert
            });
    });
});