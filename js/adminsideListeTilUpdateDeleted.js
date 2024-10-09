document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('movie-container');

    if (container) {
        // Your fetch and movie rendering code goes here
        fetch('http://localhost:8080/movie/getAllMovies')
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
                    updateButton.classList.add('btn', 'btn-warning'); // Bootstrap styling for warning button

                    // Create Delete Button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('btn', 'btn-danger'); // Bootstrap styling for danger button

                    // Add event listener for update functionality
                    updateButton.addEventListener('click', function () {
                        updateMovie(movie.id); // Call a function to handle the update logic
                    });

                    // Add event listener for delete functionality
                    deleteButton.addEventListener('click', function () {
                        deleteMovie(movie.id); // Call a function to handle the delete logic
                    });

                    movieDiv.appendChild(moviePoster);
                    movieDiv.appendChild(movieTitle);
                    movieDiv.appendChild(movieDescription);
                    movieDiv.appendChild(movieDuration);
                    movieDiv.appendChild(movieAgeLimit);
                    movieDiv.appendChild(updateButton);  // Append the update button
                    movieDiv.appendChild(deleteButton);

                    container.appendChild(movieDiv);
                });
            })
            .catch(error => console.log('Error:', error));
    } else {
        console.log("Error: The movie container was not found.");
    }
});

// Function to handle movie updates
function updateMovie(movieId) {
    // This is a placeholder for a more complex update logic
    // You could open a modal with a form to update the movie's details
    const newTitle = prompt("Enter the new title for the movie:");
    const newDescription = prompt("Enter the new description for the movie:");
    const newAgeLimit = prompt("Enter the new age limit:");
    const newDuration = prompt("Enter the new duration in minutes:");

    const updatedMovie = {
        title: newTitle,
        description: newDescription,
        ageLimit: newAgeLimit,
        duration: newDuration,
    };

    fetch(`http://localhost:8080/movie/update/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMovie),
    })
        .then(response => {
            if (response.ok) {
                alert('Movie updated successfully');
                location.reload(); // Reload the page to reflect the updated movie details
            } else {
                alert('Failed to update the movie');
            }
        })
        .catch(error => console.log('Error updating movie:', error));
}

function deleteMovie(movieId) {
    // Første forespørgsel til at tjekke for showtimes
    fetch(`http://localhost:8080/movie/${movieId}/check-before-delete`, {
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
    fetch(`http://localhost:8080/movie/${movieId}/delete?confirm=true`, {
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
