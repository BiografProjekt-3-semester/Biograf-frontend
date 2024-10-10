document.addEventListener('DOMContentLoaded', function() {
    const movieForm = document.getElementById('add-movie-form');

    // Håndter formindsendelse
    movieForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Forhindrer formularens standardindsendelse

        // Hent værdier fra inputfelterne i formularen
        const title = document.getElementById('movieTitle').value;
        const ageLimit = document.getElementById('movieAgeLimit').value;
        const duration = document.getElementById('movieDuration').value;
        const description = document.getElementById('movieDescription').value;
        const picture = document.getElementById('moviePicture').value;

        // Opret et movie-objekt med de hentede værdier
        const movie = {
            title: title,
            ageLimit: ageLimit,
            duration: duration,
            description: description,
            picture: picture
        };

        // Send en POST-anmodning til serveren for at oprette filmen
        fetch('https://biografprojekt-ghdmdwe5csahcbe3.northeurope-01.azurewebsites.net/movie/makeMovie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        })
            .then(response => response.json())
            .then(data => {
                window.location.reload();
                console.log('Succes:', data);
                alert('Filmen blev oprettet succesfuldt!');
                // Nulstil formularen efter succes
                const modalElement = document.getElementById('addShowtimeModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

                // Nulstil formularen efter success
                document.getElementById('add-showtime-form').reset();
            })
            .catch((error) => {
                console.error('Fejl ved oprettelse af filmen:', error);
                alert('Der opstod en fejl ved oprettelse af filmen.');
            });
    });
});
