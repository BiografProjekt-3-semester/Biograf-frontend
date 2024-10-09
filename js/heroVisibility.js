// Funktion til at kontrollere hvilken sektion der vises
function updateHeroSectionVisibility() {
    const heroSection = document.querySelector('.hero-section');
    const movieDetailsSection = document.getElementById('movie-details');
    const showtimeDetailsSection = document.getElementById('Showtime-details');
    const movieContainer = document.getElementById('movie-container');

    // Kun vis heroSection, når movie-container er synlig
    if (movieContainer.style.display !== 'none') {
        heroSection.style.display = 'block';
    } else {
        heroSection.style.display = 'none';
    }

    // Skjul heroSection, når vi er i movie-details eller showtime-details
    if (movieDetailsSection.style.display === 'block' || showtimeDetailsSection.style.display === 'block') {
        heroSection.style.display = 'none';
    }
}

// Kald funktionen ved siden indlæsning
updateHeroSectionVisibility();

// Lyt til ændringer i sektionerne for at opdatere synligheden af heroSection dynamisk
document.getElementById('backToMovies').addEventListener('click', () => {
    updateHeroSectionVisibility();
});
