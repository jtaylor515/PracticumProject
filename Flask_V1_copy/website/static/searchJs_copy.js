function searchRestaurants() {
  let searchQuery = document.getElementById("search-input").value;

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

      if (data && data.result) {
        // Replace \n with <br> for HTML display
        let formattedResult = data.result.replace(/\n/g, "<br>");
        // Use innerHTML since we're including HTML content (<br> tags)
        resultsContainer.innerHTML = formattedResult;
      } else {
        resultsContainer.textContent = "No results found.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("results-container").textContent =
        "Error fetching results.";
    });
}

function searchRestaurants() {
  let searchQuery = document.getElementById("search-input").value;

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

      if (data && data.result) {
        // Replace \n with <br> for HTML display
        let formattedResult = data.result.replace(/\n/g, "<br>");
        // Use innerHTML since we're including HTML content (<br> tags)
        resultsContainer.innerHTML = formattedResult;
      } else {
        resultsContainer.textContent = "No results found.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("results-container").textContent =
        "Error fetching results.";
    });
}

// Dummy JSON data
const dummyData = [
  {
    name: "Sushi Delight",
    imageUrl: "/static/images/image1.jpg", // Update path as needed for your app structure
    rating: 4.5,
    reviewCount: 124,
    details: "Authentic Japanese cuisine with a modern twist.",
  },
  {
    name: "Pasta Heaven",
    imageUrl: "/static/images/image2.jpg", // Update path as needed for your app structure
    rating: 4.7,
    reviewCount: 98,
    details: "Fresh and homemade Italian pasta dishes.",
  },
  {
    name: "Burger Hub",
    imageUrl: "/static/images/image3.jpg", // Update path as needed for your app structure
    rating: 4.3,
    reviewCount: 75,
    details: "Gourmet burgers made with locally sourced ingredients.",
  },
];

// Function to render restaurant cards
function renderRestaurantCards(data) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Clear previous results

  data.forEach((restaurant) => {
    // Create card container
    const card = document.createElement("div");
    card.className = "restaurant-card";

    // Create and add image container
    const imageDiv = document.createElement("div");
    imageDiv.className = "card-image";
    imageDiv.style.backgroundImage = `url(${restaurant.imageUrl})`;
    card.appendChild(imageDiv);

    // Create and add info container
    const infoDiv = document.createElement("div");
    infoDiv.className = "card-info";

    // Add name
    const nameElement = document.createElement("div");
    nameElement.className = "name";
    nameElement.textContent = restaurant.name;
    infoDiv.appendChild(nameElement);

    // Add details
    const detailsElement = document.createElement("div");
    detailsElement.className = "details";
    detailsElement.textContent = restaurant.details;
    infoDiv.appendChild(detailsElement);

    // Create and add rating and review count container
    const ratingReviewDiv = document.createElement("div");
    ratingReviewDiv.className = "rating-review";

    const ratingElement = document.createElement("div");
    ratingElement.className = "rating";
    ratingElement.textContent = `Rating: ${restaurant.rating} stars`;
    ratingReviewDiv.appendChild(ratingElement);

    const reviewCountElement = document.createElement("div");
    reviewCountElement.className = "review-count";
    reviewCountElement.textContent = `${restaurant.reviewCount} reviews`;
    ratingReviewDiv.appendChild(reviewCountElement);

    // Append rating and review container to info container
    infoDiv.appendChild(ratingReviewDiv);

    // Append info container to card
    card.appendChild(infoDiv);

    // Append card to results container
    resultsContainer.appendChild(card);
  });
}
