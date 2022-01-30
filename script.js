const key = "59dc815452mshc3ad483fa7dc4f8p17f8c2jsn7ccefb0b2a74";
const baseURL = "https://data-imdb1.p.rapidapi.com";
const containerDiv = document.querySelector(".container");
const searchInput = document.querySelector(".search-input");

// fetch most mopular movies list
async function getMostPopular() {
    const response = await fetch(`${baseURL}/movie/order/byPopularity/?page_size=50`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key": `${key}`
        }
    });

    const data = await response.json();

    if (response.status < 400) {
        containerDiv.innerHTML = `
            <h1>Most Popular</h1>
            <div class="cards-container"></div>
        `;

        data.results.forEach(result => {
            // Get each movie info by its ID and render it as movie card list
            renderMovieList(result.imdb_id);
        });

    } else {
        console.error("Trouble getting most popular movies list!");
    }
}

// fetch highest rated movies list
async function getHighRated() {
    const response = await fetch(`${baseURL}/movie/order/byRating/?page_size=50`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key": `${key}`
        }
    });

    const data = await response.json();


    if (response.status < 400) {
        containerDiv.innerHTML = `
            <h1>Highest Rated Movies</h1>
            <div class="cards-container"></div>
    `;

        data.results.forEach(result => {
            // Get each movie info by its ID
            renderMovieList(result.imdb_id);
        });
    } else {
        console.error("Trouble getting highest rated movies list!");
    }
}

// display all genres list
async function renderGenresList() {
    const response = await fetch(`${baseURL}/genres/`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key": `${key}`
        }
    });

    const data = await response.json();

    if (response.status < 400) {
        containerDiv.innerHTML = `
        <h1>Movie Genres</h1>
        <ul class="genre-list"></ul>
        `;

        data.results.forEach(result => {
            containerDiv.querySelector(".genre-list").innerHTML += `<li>${result.genre}</li>`;
        });

        document.
            querySelectorAll(".genre-list li").
            forEach(el => el.addEventListener("click", () => {
                getByGenre(el.innerText);
            }));


    } else {
        console.error("Trouble getting movie genre list!");
    }
};

// fetch particular genre list after clicking on genre
async function getByGenre(genre) {

    const response = await fetch(`${baseURL}/movie/byGen/${genre}/?page_size=50`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key": `${key}`
        }
    });

    const data = await response.json();

    if (response.status < 400) {
        containerDiv.innerHTML = `
            <h1>Movies by Genre: ${genre}</h1>
            <div class="cards-container"></div>
        `;

        data.results.forEach(result => {
            // Get each movie info by its ID
            renderMovieList(result.imdb_id);
        });


    } else {
        console.error("Trouble getting movie list from a particular genre!");
    }
}

// fetch movie info for each id
async function getMovieById(movieId) {
    const response = await fetch(`${baseURL}/movie/id/${movieId}/`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key": `${key}`
        }
    });

    const data = await response.json();

    // data.results for movie by ID gives an array of objects
    if (response.status < 400) {
        return data.results;
    } else {
        console.error("Could not get the data by movie ID!");
    }

}

// get string of genres to display in page
function getMovieGenreList(gen) {
    const genreList = [];
    gen.forEach(el => genreList.push(el.genre));

    return genreList.join(", ");
}

// get year of release to display in page
function releasedYear(release) {
    if (release == null) { return "n.a." }
    return release.split("-")[0];
}

// render movie cards list in page after each movie list request
async function renderMovieList(id) {
    const cardsContainer = document.querySelector(".container .cards-container");

    const data = await getMovieById(id);

    const { title, image_url, rating, release, gen, popularity, imdb_id } = data;

    const genList = getMovieGenreList(gen);
    const releaseYear = releasedYear(release);

    cardsContainer.innerHTML += `
        <div class="movie-card" id="${imdb_id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <h3 class="card-title">${title}</h3>
            <div class="release-year"><span>Released: </span>${releaseYear}</div>
            <div class="card-genre"><span>Genre: </span>${genList}</div>
            <img src="${image_url}"
            alt="" class="card-image">
            <div class="card-stats">
                <div class="imdb-rating">
                    <p>IMDB rating:</p>
                    <p>${rating}</p>
                </div>
                <div class="popularity">
                    <p>Popularity:</p>
                    <p>${popularity}</p>
                </div>
            </div>
        </div>
        `;
// if movie card clicked open modal with movie info
    document.
        querySelectorAll(".movie-card").
        forEach(el => el.addEventListener("click", () => renderMoviePage(el.id)));
}

// render page containing movie info in modal window
async function renderMoviePage(id) {

    const modalDialog = document.querySelector(".modal-dialog");

    const data = await getMovieById(id);

    const { title, release, content_rating, rating, popularity, gen, movie_length, plot, description, banner } = data;

    const genList = getMovieGenreList(gen);
    const releaseYear = releasedYear(release);

    modalDialog.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title movie-title" id="exampleModalLabel">${title}</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="movie-page">
        <div class="modal-body movie-content">
            <div class="movie-stats">
            <div class="release-year"><span>Released: </span>${releaseYear}</div>
            <div class="content-rating"><span>Content Rating:</span>${content_rating}</div>
            <div class="imdb-rating"><span>IMDB rating:</span>${rating}</div>
            <div class="popularity"><span>Popularity:</span>${popularity}</div>
            </div>

            <div class="movie-genre"><span>Genre: </span>${genList}</div>
            <div class="movie-length"><span>Length:</span> ${movie_length} min</div>

            <p class="movie-plot"><span>Plot:</span> ${plot}</p>

            <p class="movie-description"><span>Synopsis: </span>${description}</p>
        </div>
        <div class="movie-banner">
            <img src="${banner}"
            alt="" />
        </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    </div>
    `;
}

// fetch movie title data from search query and display it as movie card list
async function renderSearchResults(searchQuery) {
    const response = await fetch(`${baseURL}/movie/imdb_id/byTitle/${searchQuery}/`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key": `${key}`
        }
    });

    const data = await response.json();

    if (response.status < 400) {
        containerDiv.innerHTML = `
            <h2>Showing results for: ${searchQuery}</h2>
            <div class="cards-container"></div>
        `;

        data.results.forEach(result => {
            // Get each movie info by its ID
            renderMovieList(result.imdb_id);
        });

    } else {
        console.error("Trouble getting search results!");
    }

    searchInput.value = "";
}

document.
    querySelector(".nav-popular-movies").
    addEventListener("click", getMostPopular);

document.
    querySelector(".nav-high-rated-movies").
    addEventListener("click", getHighRated);

document.
    querySelector(".nav-by-genre-movies").
    addEventListener("click", renderGenresList);

document.
    querySelector(".search-form").
    addEventListener("submit", (event) => {
        event.preventDefault();
        renderSearchResults(searchInput.value);
    });
