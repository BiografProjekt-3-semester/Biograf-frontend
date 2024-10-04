const container = document.getElementById('movie-container');

// Fetch data from your backend API
fetch('http://localhost:8080/movie/getAllMovies')  // Din backend-API
    .then(response => response.json())
    .then(data => {
        // Hvis dit backend-API returnerer en liste af film
        data.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            
            const moviePoster = document.createElement('img');
            moviePoster.src = movie.picture; // movie.picture matcher din backend's 'picture' felt
            moviePoster.alt = movie.title;

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
