document.addEventListener('DOMContentLoaded', function() {
    const movieSelect = document.getElementById('editMovieSelect');
    const showtimeSelect = document.getElementById('showtimeSelect');
    const editShowtimeForm = document.getElementById('edit-showtime-form');

    // Fetch all movies and populate movie dropdown
    fetch('https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/movie/getAllMovies')
        .then(response => response.json())
        .then(movies => {
            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.id;
                option.textContent = movie.title;
                movieSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Fejl ved hentning af film:', error));

    // Listen for movie selection change and fetch showtimes for the selected movie
    movieSelect.addEventListener('change', function() {
        const movieId = movieSelect.value;
        fetch(`https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/api/showTimes/movie/${movieId}`)
            .then(response => response.json())
            .then(showtimes => {
                showtimeSelect.innerHTML = '<option value="" disabled selected>Vælg en showtime</option>'; // Clear old options
                showtimes.forEach(showtime => {
                    const option = document.createElement('option');
                    option.value = showtime.id;
                    option.textContent = `${showtime.movieDate} - ${showtime.startTime}`;
                    showtimeSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Fejl ved hentning af showtimes:', error));
    });

    // Populate form with showtime data when a showtime is selected
    showtimeSelect.addEventListener('change', function() {
        const showtimeId = showtimeSelect.value;
        fetch(`https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/api/showTimes/${showtimeId}`)
            .then(response => response.json())
            .then(showtime => {
                document.getElementById('editMovieDate').value = showtime.movieDate;
                document.getElementById('editStartTime').value = showtime.startTime;
                document.getElementById('editEndTime').value = showtime.endTime;
                document.getElementById('editPrice').value = showtime.price;
            })
            .catch(error => console.error('Fejl ved hentning af showtime data:', error));
    });

    // Handle form submission for editing showtime
    editShowtimeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const showtimeId = showtimeSelect.value;
        const updatedShowtime = {
            movieDate: document.getElementById('editMovieDate').value,
            startTime: document.getElementById('editStartTime').value,
            endTime: document.getElementById('editEndTime').value,
            price: parseFloat(document.getElementById('editPrice').value)
        };

        fetch(`https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/api/showTimes/${showtimeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedShowtime)
        })
            .then(response => {
                if (!response.ok) throw new Error('Error editing showtime');
                return response.json();
            })
            .then(data => {
                alert('Showtime updated successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('editShowtimeModal'));
                modal.hide();  // Close modal
            })
            .catch(error => console.error('Error updating showtime:', error));
    });
});
