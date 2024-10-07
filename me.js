body {
    width: 100vw;
    height: 100vh;
    /* display: flex; */
    justify-content: center;
    font-family: sans-serif;
    padding: 0.5rem;
    background-color: #f2f3f4;
  }
  h1 {
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
  }
  .movie-details {
    margin-top: -1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.6rem;
  }
  .movie {
      background-color: #ffff;
      padding: .1rem;
      border-radius: .3rem;
      box-shadow: 0 4px 8px rgba(0,0,0, 0.1);
  }
  .movie-image{
      width: 100%;
      height: auto;
      border-radius: .3rem;
  }
  .movie-title{
      color: blue;
      font-size: 18px;
      font-weight: bold;
      margin: 1rem 0;
  }

  //// js
  /*const moviesUrl = "https://dummyapi.online/api/movies";
console.log(moviesUrl);

console.log(moviesUrl);
// fetch data from API
async function fetchMovies() {
  try {
    const response = await fetch(omdbUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
console.log(fetchMovies());

const rendermovies = async (movies) => {
  const dock = document.querySelector(".movies");

  movies.forEach((movi) => {
    const sectmov = document.createElement("div");
    sectmov.classList.add("sect-move");

    const movietitle = document.createElement("h1");
    movietitle.classList.add("movie-title");
    movietitle.textContent = movi.movie;

    // const movieImage = document.createElement("img");
    // movieImage.classList.add("movie-image");
    // movieImage.src = movi.image;
    // movieImage.alt = movi.image;

    sectmov.appendChild(movietitle);
    // sectmov.appendChild(movieImage);
    dock.append(sectmov);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const listofmovies = await fetchMovies();

  if (listofmovies) {
    rendermovies(listofmovies);
  }
});

*/
const omdbApiKey = "7738d88";
const searchQuery = "Inception"; // Search query for movies
const maxResults = 100; // Desired number of movies
const moviesPerPage = 10; // Movies per request
const totalPages = Math.ceil(maxResults / moviesPerPage); // Calculate total pages

async function fetchMovies(page) {
    const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${encodeURIComponent(searchQuery)}&page=${page}`;
    
    try {
        const response = await fetch(omdbUrl);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        return data.Search || []; // Return an array of movies
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return []; // Return an empty array on error
    }
}

// Render multiple movie details
const renderMovies = (movies) => {
    const dock = document.querySelector(".movie-details");

    if (!dock) {
        console.error("Element with class 'movie-details' not found.");
        return; // Exit the function if the element is not found
    }

    // Clear any previous content
    dock.innerHTML = '';

    movies.forEach((movie) => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie");

        const movieTitle = document.createElement("h1");
        movieTitle.classList.add("movie-title");
        movieTitle.textContent = movie.Title;

        const movieImage = document.createElement("img");
        movieImage.classList.add("movie-image")
        movieImage.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"; // Use a placeholder if no poster

        const movieYear = document.createElement("p");
        movieYear.textContent = `Year: ${movie.Year}`;

        // Append elements to the movie container
        movieContainer.appendChild(movieTitle);
        movieContainer.appendChild(movieImage);
        movieContainer.appendChild(movieYear);

        
        // Append movie container to the main dock
        dock.append(movieContainer);
    });
};

// Fetch and display movies when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    let allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
        const moviesData = await fetchMovies(page);
        allMovies = allMovies.concat(moviesData);

        // Break if we already have enough movies
        if (allMovies.length >= maxResults) {
            break;
        }
    }

    // Trim to the maximum number of results needed
    allMovies = allMovies.slice(0, maxResults);

    if (allMovies.length > 0) {
        renderMovies(allMovies);
    } else {
        console.error("No movies found or error in response.");
    }
});

