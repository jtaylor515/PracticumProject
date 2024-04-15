function searchRestaurants() {
  let searchQuery = document.getElementById("search-input").value;
  let loadingSpinner = document.querySelector(".loading-spinner");
  loadingSpinner.style.display = "flex"; // Show the loading spinner

  fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: searchQuery }),
  })
    .then((response) => response.json())
    .then((data) => {
      let resultsContainer = document.getElementById("results-container");
      resultsContainer.innerHTML = ""; // Clear previous results

      if (data && data.recommendations) {
        renderRestaurantCards(data);
      } else if (data && data.error) {
        resultsContainer.textContent = data.error;
      } else {
        resultsContainer.textContent = "No results found.";
      }

      loadingSpinner.style.display = "none"; // Hide the loading spinner
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("results-container").textContent =
        "Error fetching results.";
      loadingSpinner.style.display = "none"; // Hide the loading spinner
    });
}

function renderRestaurantCards(data) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Clear previous results

  data.recommendations.forEach((restaurant, index) => {
    // Create card container
    const card = document.createElement("div");
    card.className = "restaurant-card";

    // Create and add image container
    const imageDiv = document.createElement("div");
    imageDiv.className = "card-image";

    // Set the background image URL based on the index
    const imageUrl = `/static/images/restaurant${index + 1}.jpeg`;
    imageDiv.style.backgroundImage = `url(${imageUrl})`;

    card.appendChild(imageDiv);

    // Create and add info container
    const infoDiv = document.createElement("div");
    infoDiv.className = "card-info";

    // Add name
    const nameElement = document.createElement("div");
    nameElement.className = "name";
    nameElement.textContent = restaurant.name;
    infoDiv.appendChild(nameElement);

    // Create and add rating and review count container
    const ratingReviewDiv = document.createElement("div");
    ratingReviewDiv.className = "rating-review";

    const ratingElement = document.createElement("div");
    ratingElement.className = "rating";
    ratingElement.textContent = `Rating: ${restaurant.stars} stars`;
    ratingReviewDiv.appendChild(ratingElement);

    const reviewCountElement = document.createElement("div");
    reviewCountElement.className = "review-count";
    reviewCountElement.textContent = `${restaurant.review_count} reviews`;
    ratingReviewDiv.appendChild(reviewCountElement);

    // Append rating and review container to info container
    infoDiv.appendChild(ratingReviewDiv);

    // Append info container to card
    card.appendChild(infoDiv);

    // Append card to results container
    resultsContainer.appendChild(card);
  });
}
