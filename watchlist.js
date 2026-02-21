const omdbApiBaseUrl = "https://www.omdbapi.com/?apikey=6de98b2f&"
let watchlist = localStorage.getItem("watchlist")
                            ? JSON.parse(localStorage.getItem("watchlist"))
                            : []
fetchMoviesFromLocalStorage()

async function fetchMoviesFromLocalStorage() {
    const resultsPlaceholder = document.querySelector(".results-section-placeholder")
    const resultsContainer = document.querySelector(".result-section-card-container")

    if(watchlist.length > 0) {
        let cardsHtml = ""
        watchlist.forEach(imdbID => {
            fetchMovieInfo(imdbID)
                .then(movie => {
                    if(movie.imdbID) {
                        cardsHtml += `
                            <div class="results-section-card">
                            <div class="results-section-card-poster-container" aria-hidden="true">
                                <img src="${movie.Poster}" alt="">
                            </div>
                            <div class="result-section-card-content">
                                <div class="result-section-card-title-rating-container">
                                    <h2 class="result-section-card-title">${movie.Title}</h2>
                                    <span class="result-section-card-rating">
                                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.86276 0.518226C5.08727 -0.172757 6.06483 -0.172758 6.28934 0.518225L7.09152 2.98707C7.19193 3.29609 7.47989 3.50531 7.80481 3.50531H10.4007C11.1273 3.50531 11.4293 4.43502 10.8416 4.86207L8.74142 6.3879C8.47856 6.57889 8.36856 6.91741 8.46897 7.22643L9.27115 9.69528C9.49566 10.3863 8.7048 10.9609 8.11702 10.5338L6.01689 9.00797C5.75402 8.81699 5.39808 8.81699 5.13521 9.00797L3.03508 10.5338C2.4473 10.9609 1.65644 10.3863 1.88095 9.69528L2.68313 7.22643C2.78354 6.91741 2.67354 6.57889 2.41068 6.3879L0.31055 4.86207C-0.277235 4.43502 0.0248458 3.50531 0.751388 3.50531H3.34729C3.67221 3.50531 3.96017 3.29609 4.06058 2.98707L4.86276 0.518226Z" fill="#FEC654"/>
                                    </svg>
                                    ${movie.imdbRating}
                                </span>
                                </div>
                                <div class="result-section-card-duration-genre-btn-container">
                                    <span class="result-section-card-duration">${movie.Runtime}</span>
                                    <span class="result-section-card-genre">${movie.Genre}</span>
                                    <button class="remove-from-watchlist-button" data-imdbid="${movie.imdbID}">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9H11C11.5523 9 12 8.55229 12 8C12 7.44772 11.5523 7 11 7H5Z" fill="#111827"/>
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                                <p class="result-section-card-plot">${movie.Plot}</p>
                            </div>
                        </div>
                    `
                    }
                })
                .then(()=>{
                    if(cardsHtml === "") {
                        resultsPlaceholder.innerHTML = "<p>Unable to find what you’re looking for. Please try another search.</p>"
                        resultsPlaceholder.classList.remove("hidden")
                        resultsContainer.innerHTML = ""
                    } else {
                        resultsPlaceholder.classList.add("hidden")
                        resultsContainer.innerHTML = cardsHtml
                    }
                })

        })
    } else {
        resultsPlaceholder.innerHTML = `
            <p>Your watchlist is looking a little empty...</p>
            <a href="./index.html" class="add-watchlist-link">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" />
                </svg>
                Let’s add some movies!
            </>
        `
        resultsPlaceholder.classList.remove("hidden")
        resultsContainer.innerHTML = ""
    }
}

async function fetchMovieInfo(imdbID) {
    const res = await fetch(omdbApiBaseUrl + "i=" + imdbID)
    return await res.json()
}

document.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-from-watchlist-button")) {
        console.log(event.target.dataset.imdbid)
        console.log(watchlist)
        console.log(watchlist.includes(event.target.dataset.imdbid))
        if(watchlist.includes(event.target.dataset.imdbid)) {
            watchlist = watchlist.filter(imdbId => imdbId !== event.target.dataset.imdbid)
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
            fetchMoviesFromLocalStorage()
        } else {
            alert("Movie already removed to watchlist")
        }
    }
})
