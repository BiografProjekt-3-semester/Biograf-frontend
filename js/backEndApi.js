const container = document.getElementById('movie-container');

// Fetch data from your backend API
fetch('http://localhost:8080/movie/getAllMovies')  // Din backend-API //Din aasds
    .then(response => response.json())
    .then(data => {
        // Hvis dit backend-API returnerer en liste af film
        data.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.dataset.id = movie.id; // Gem filmens ID i data-attribut


            const moviePoster = document.createElement('img');
            moviePoster.src = movie.picture; // movie.picture matcher din backend's 'picture' felt
            moviePoster.alt = movie.title;

            moviePoster.addEventListener('click', function () {
               showMovieDetails(movie);
            });

            const movieTitle = document.createElement('h3');
            movieTitle.textContent = movie.title; // movie.title matcher 'title' feltet

            const movieDescription = document.createElement('p');
            movieDescription.textContent = movie.description; // movie.description matcher 'description' feltet

            const movieDuration = document.createElement('p');
            movieDuration.textContent = `Duration: ${movie.durationEkstra}`; // Matcher 'duration' og 'durationEkstra'

            const movieAgeLimit = document.createElement('p');
            movieAgeLimit.textContent = `Age Limit: ${movie.ageLimit}`; // Matcher 'ageLimit'

            // Append alle elementerne til movieDiv
            movieDiv.appendChild(moviePoster);
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieDescription);
            movieDiv.appendChild(movieDuration);
            movieDiv.appendChild(movieAgeLimit);

           /* movieDiv.addEventListener('click', () => {
                window.location.href = `http://localhost:8080/movie/${movie.id}`; // Naviger til filmens side
            });*/

            // Append movieDiv til containeren
            container.appendChild(movieDiv);
        });
    })
    .catch(error => console.log('Error:', error));

function showMovieDetails(movie) {
    // Opdater detaljerne i sektionen
    moviePoster.src = movie.picture;
    movieTitle.textContent = movie.title;
    movieDescription.textContent = movie.description;
    movieDuration.textContent = `Varighed: ${movie.durationEkstra}`;
    movieAgeLimit.textContent = `Aldersgrænse: ${movie.ageLimit}`;

    // Ryd tidligere showtimes og opdater med de nye fra backend
    movieShowtimes.innerHTML = '';

    // Fetch visningstider fra backend baseret på filmens ID
    fetch(`http://localhost:8080/api/showtimes/movie/${movie.id}`)
        .then(response => response.json())
        .then(showtimes => {
            if (showtimes.length > 0) {
                showtimes.forEach(showtime => {
                    const showtimeDiv = document.createElement('div');
                    showtimeDiv.classList.add('showtime');
                    showtimeDiv.textContent = `${showtime.movieDate} - ${showtime.startTime} - Sal:${showtime.theaterID.name}`;
                    movieShowtimes.appendChild(showtimeDiv);
                });
            } else {
                movieShowtimes.textContent = "Ingen visningstider tilgængelige";
            }
        })
        .catch(error => console.log('Error:', error));

    // Skjul filmoversigten og vis filmens detaljer
    container.style.display = "none";
    detailsSection.style.display = "block";
}
