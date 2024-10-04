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
        fetch('http://localhost:8080/movie/makeMovie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Succes:', data);
                alert('Filmen blev oprettet succesfuldt!');
                // Nulstil formularen efter succes
                movieForm.reset();
            })
            .catch((error) => {
                console.error('Fejl ved oprettelse af filmen:', error);
                alert('Der opstod en fejl ved oprettelse af filmen.');
            });
    });
});