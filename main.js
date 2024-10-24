const API_KEY = "7738d88"; // Your API key
const MOVIE_API = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&s=';
const SEARCH_API = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&s=';

document.addEventListener("DOMContentLoaded", () => {
    fetchTrendingMovies(); 
    document.getElementById('search-bar').addEventListener('input', handleSearch);
});

async function fetchTrendingMovies() {
    try {
        const response = await fetch(MOVIE_API + 'movie');
        const data = await response.json();
        if (data.Response === "True") {
            renderMovies(data.Search);
        } else {
            console.error('Error fetching trending movies:', data.Error);
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

function renderMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <div class="movie-details">
                <h3>${movie.Title}</h3>
                <button onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
            </div>
        `;
        moviesList.appendChild(card);
    });
}

async function handleSearch() {
    const query = document.getElementById('search-bar').value;
    if (query) {
        try {
            const response = await fetch(SEARCH_API + encodeURIComponent(query));
            const data = await response.json();
            if (data.Response === "True") {
                renderMovies(data.Search);
                renderAutocomplete(data.Search);
            } else {
                console.error('Error fetching search results:', data.Error);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    } else {
        fetchTrendingMovies();
    }
}

function renderAutocomplete(movies) {
    const suggestions = document.getElementById('autocomplete-suggestions');
    suggestions.innerHTML = '';
    movies.forEach(movie => {
        const suggestion = document.createElement('div');
        suggestion.textContent = movie.Title;
        suggestion.onclick = () => {
            document.getElementById('search-bar').value = movie.Title;
            suggestions.innerHTML = '';
        };
        suggestions.appendChild(suggestion);
    });
}

function addToWatchlist(movieId) {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
    }
}

function renderWatchlist() {
    const watchlistContainer = document.getElementById('watchlist-container');
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlistContainer.innerHTML = '';
    watchlist.forEach(movieId => {
        fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`)
            .then(response => response.json())
            .then(movie => {
                if (movie.Response === "True") {
                    const card = document.createElement('div');
                    card.classList.add('movie-card');
                    card.innerHTML = `
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                        <div class="movie-details">
                            <h3>${movie.Title}</h3>
                            <button onclick="removeFromWatchlist('${movieId}')">Remove</button>
                        </div>
                    `;
                    watchlistContainer.appendChild(card);
                }
            });
    });
}

function removeFromWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(id => id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
}

renderWatchlist();
