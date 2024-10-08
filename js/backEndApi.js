const container = document.getElementById('movie-container');

// Fetch data from your backend API
fetch('http://localhost:8080/movie/getAllMovies')
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

            moviePoster.addEventListener('click', function() {
                console.log("Clicked movie id: ", movie.id);
                showMovieDetails(movie);  // Kalder showMovieDetails med filmens data
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

            // Append movieDiv til containeren
            container.appendChild(movieDiv);
        });
    })
    .catch(error => console.log('Error:', error));

// Funktion til at vise filmens detaljer
function showMovieDetails(movie) {
    const detailsSection = document.getElementById("movie-details");  // Henter detaljer-sektionen
    const moviePoster = document.getElementById("moviePoster");       // Henter plakat-elementet
    const movieTitle = document.getElementById("movieTitle");         // Henter titel-elementet
    const movieDescription = document.getElementById("movieDescription"); // Henter beskrivelse-elementet
    const movieDuration = document.getElementById("movieDuration");   // Henter varighed-elementet
    const movieAgeLimit = document.getElementById("movieAgeLimit");   // Henter aldersgrænse-elementet
    const movieShowtimes = document.getElementById("movieShowtimes"); // Henter visningstider-elementet

    // Kontrollér ID og opdater filmens detaljer i DOM'en
    console.log("Movie ID modtaget: ", movie.id);
    moviePoster.src = movie.picture;
    movieTitle.textContent = movie.title;
    movieDescription.textContent = movie.description;
    movieDuration.textContent = `Varighed: ${movie.durationEkstra}`;
    movieAgeLimit.textContent = `Aldersgrænse: ${movie.ageLimit}`;

    // Ryd tidligere visningstider og fetch de nye baseret på filmens ID
    movieShowtimes.innerHTML = '';

    // Fetch visningstider baseret på filmens ID
    fetch(`http://localhost:8080/api/showTimes/movie/${movie.id}`)
        .then(response => response.json())
        .then(showtimes => {
            // Opdater visningstider i DOM'en
            if (showtimes.length > 0) {
                showtimes.forEach(showtime => {
                    const showtimeDiv = document.createElement('div');
                    showtimeDiv.classList.add('showtime');
                    showtimeDiv.textContent = `${showtime.movieDate} - ${showtime.startTime} - Sal: ${showtime.theater.id}`;
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

// Implementering af knappen "Tilbage til filmoversigt"
document.getElementById('backToMovies').addEventListener('click', function () {
    // Skjul sektionen med filmens detaljer
    document.getElementById('movie-details').style.display = 'hidden';

    // Vis sektionen med filmene (hvis du har en sektion til filmoversigten)
    document.getElementById('movie-container').style.display = 'block';
    window.location.reload();
});