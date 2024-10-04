const apiKey = 'd83ad2f6'; // Din API-key fra OMDBAPI
const movieTitles = ['Inception', 'Avatar', 'Titanic', 'The Matrix', 'Batman', 'Interstellar']; // Film du vil søge efter

const container = document.getElementById('movie-container');

movieTitles.forEach(title => {
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`)  // Bruger backticks her
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');
                
                const moviePoster = document.createElement('img');
                moviePoster.src = data.Poster;
                moviePoster.alt = data.Title;

                const movieTitle = document.createElement('h3');
                movieTitle.textContent = data.Title;

                movieDiv.appendChild(moviePoster);
                movieDiv.appendChild(movieTitle);
                container.appendChild(movieDiv);
            }
        })
        .catch(error => console.log('Error:', error));
});
