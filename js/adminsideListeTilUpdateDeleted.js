document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('movie-container');

    if (container) {
        fetch('https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/movie/getAllMovies')
            .then(response => response.json())
            .then(data => {
                data.forEach(movie => {
                    const movieDiv = document.createElement('div');
                    movieDiv.classList.add('movie');
                    movieDiv.dataset.id = movie.id;

                    const moviePoster = document.createElement('img');
                    moviePoster.src = movie.picture;
                    moviePoster.alt = movie.title;

                    const movieTitle = document.createElement('h3');
                    movieTitle.textContent = movie.title;

                    const movieDescription = document.createElement('p');
                    movieDescription.textContent = movie.description;

                    const movieDuration = document.createElement('p');
                    movieDuration.textContent = `Duration: ${movie.durationEkstra}`;

                    const movieAgeLimit = document.createElement('p');
                    movieAgeLimit.textContent = `Age Limit: ${movie.ageLimit}`;

                    // Create Update Button
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.classList.add('btn', 'btn-warning');

                    // Create Delete Button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('btn', 'btn-danger');

                    updateButton.addEventListener('click', function () {
                        // Brug modal-vinduet og fyld det med filmdata
                        openUpdateModal(movie);
                    });

                    deleteButton.addEventListener('click', function () {
                        deleteMovie(movie.id);
                    });

                    movieDiv.appendChild(moviePoster);
                    movieDiv.appendChild(movieTitle);
                    movieDiv.appendChild(movieDescription);
                    movieDiv.appendChild(movieDuration);
                    movieDiv.appendChild(movieAgeLimit);
                    movieDiv.appendChild(updateButton);
                    movieDiv.appendChild(deleteButton);

                    container.appendChild(movieDiv);
                });
            })
            .catch(error => console.log('Error:', error));
    } else {
        console.log("Error: The movie container was not found.");
    }
});
function openUpdateModal(movie) {
    const titleInput = document.getElementById('UPmovieTitle');
    const durationEkstra = document.getElementById('UPmovieDirector');
    const ageLimit = document.getElementById('UPmovieLimit');
    const genreInput = document.getElementById('UPmovieGenre');

    // Fyld modalens inputfelter med de nuværende værdier fra filmen
    titleInput.value = movie.title;
    durationEkstra.value = movie.durationEkstra;
    ageLimit.value = movie.ageLimit;
    genreInput.value = movie.description;

    // Tilføj event listener til "Save"-knappen (kun én gang)
    const saveButton = document.getElementById('saveButton');
    saveButton.onclick = function() {
        const updatedMovie = {
            title: titleInput.value,
            durationEkstra: durationEkstra.value,
            ageLimit: ageLimit.value,
            description: genreInput.value
        };

        updateMovie(movie.id, updatedMovie); // Opdater filmen
    };

    // Åbn modal med Bootstrap
    var updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    updateModal.show();
}

function updateMovie(movieId, updatedMovie) {
    fetch(`https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/movie/${movieId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMovie),
    })
        .then(response => {
            if (response.ok) {
                location.reload(); // Opdater siden for at vise den opdaterede film
            } else {
                alert('Failed to update the movie');
            }
        })
        .catch(error => console.log('Error updating movie:', error));
}

function deleteMovie(movieId) {
    // Første forespørgsel til at tjekke for showtimes
    fetch(`https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/movie/${movieId}/check-before-delete`, {
        method: 'GET',
    })
        .then(response => response.text())  // Henter svaret som tekst
        .then(data => {
            if (data.includes("visningstider")) {
                // Hvis der er showtimes, spørg om bekræftelse
                if (confirm(data + "\nVil du stadig slette denne film?")) {
                    // Hvis brugeren bekræfter, slet filmen
                    confirmDelete(movieId);
                }
            } else {
                // Hvis der ikke er showtimes, spørg om de vil slette direkte
                if (confirm("Filmen har ingen visningstider. Vil du slette den?")) {
                    confirmDelete(movieId);
                }
            }
        })
        .catch(error => console.log('Error checking movie before delete:', error));
}

function confirmDelete(movieId) {
    // Anden forespørgsel til at slette filmen efter bekræftelse
    fetch(`https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/movie/${movieId}/delete?confirm=true`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8' // Indicates the content
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Filmen blev slettet.');
                location.reload(); // Reload siden for at opdatere listen
            } else {
                alert('Kunne ikke slette filmen.');
            }
        })
        .catch(error => console.log('Error deleting movie:', error));
}
