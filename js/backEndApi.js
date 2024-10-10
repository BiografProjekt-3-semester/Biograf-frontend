const container = document.getElementById('movie-container');

// Fetch data from your backend API to get all movies
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
    const heroSection = document.querySelector('.hero-section');
    heroSection.style.display = 'none'; // Skjul hero-sektionen

    const detailsSection = document.getElementById("movie-details");
    const moviePoster = document.getElementById("moviePoster");
    const movieTitle = document.getElementById("movieTitle");
    const movieDescription = document.getElementById("movieDescription");
    const movieDuration = document.getElementById("movieDuration");
    const movieAgeLimit = document.getElementById("movieAgeLimit");
    const movieShowtimes = document.getElementById("movieShowtimes");

    sessionStorage.setItem('selectedMovieId', movie.id);

    // Kontrollér ID og opdater filmens detaljer i DOM'en
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
            if (showtimes.length > 0) {
                showtimes.forEach(showtime => {
                    // Opret en knap til hver showtime
                    const showtimeButton = document.createElement('button');
                    showtimeButton.classList.add('showtime', 'available');
                    showtimeButton.textContent = `${showtime.movieDate} - ${showtime.startTime} - Sal: ${showtime.theater.id}`;

                    // Event-handler for showtime-knappen
                    showtimeButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        console.log("Clicked showtime ID: ", showtime.id);
                        sessionStorage.setItem('selectedShowtimeId', showtime.id);
                        console.log("Stored showtime ID in sessionStorage: ", sessionStorage.getItem('selectedShowtimeId'));
                        detailsSection.style.display = 'none';
                        document.getElementById('Showtime-details').style.display = 'block';
                        generateSeats(showtime.id);
                    });

                    movieShowtimes.appendChild(showtimeButton);
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

function filterShowtimesByDate() {
    const movieShowtimes = document.getElementById("movieShowtimes");
    const selectedDate = document.getElementById("showtime-date").value;
    const movieId = sessionStorage.getItem('selectedMovieId'); // Retrieve the saved movie ID

    if (!selectedDate) {
        fetch(`http://localhost:8080/api/showTimes/movie/${movieId}`)
            .then(response => response.json())
            .then(showtimes => {
                movieShowtimes.innerHTML='';
                if (showtimes.length > 0) {
                    showtimes.forEach(showtime => {
                        const showtimeButton = document.createElement('button');
                        showtimeButton.classList.add('showtime', 'available');
                        showtimeButton.textContent= `${showtime.movieDate} - ${showtime.startTime} - Sal: ${showtime.theater.id}`;

                        showtimeButton.addEventListener('click', function(event) {
                            event.preventDefault();
                            sessionStorage.setItem('selectedShowtimeId', showtime.id);
                            document.getElementById('movie-details').style.display = 'none';
                            document.getElementById('Showtime-details').style.display = 'block';
                            generateSeats(showtime.id);
                        });

                        movieShowtimes.appendChild(showtimeButton);
                    });
                } else{
                    movieShowtimes.textContent = "Ingen visningstider";
                }
            })
            .catch(error=> console.log('Error:', error));
        return;
    }

    // Clear current showtimes
    movieShowtimes.innerHTML = '';

    // Fetch showtimes for the selected date and movie
    fetch(`http://localhost:8080/api/showTimes/movies/${movieId}?date=${selectedDate}`)
        .then(response => response.json())
        .then(showtimes => {
            if (showtimes.length > 0) {
                showtimes.forEach(showtime => {
                    // Create a button for each showtime
                    const showtimeButton = document.createElement('button');
                    showtimeButton.classList.add('showtime', 'available');
                    showtimeButton.textContent = `${showtime.movieDate} - ${showtime.startTime} - Sal: ${showtime.theater.id}`;


                    // Add click event for the showtime button
                    showtimeButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        sessionStorage.setItem('selectedShowtimeId', showtime.id);
                        document.getElementById('movie-details').style.display = 'none';
                        document.getElementById('Showtime-details').style.display = 'block';
                        generateSeats(showtime.id);
                    });

                    movieShowtimes.appendChild(showtimeButton);
                });
            } else {
                movieShowtimes.textContent = "Ingen visningstider tilgængelige for den valgte dato.";
            }
        })
        .catch(error => console.log('Error:', error));
}
function clearDateFilter() {
  document.getElementById("showtime-date").value='';
  filterShowtimesByDate();
}
