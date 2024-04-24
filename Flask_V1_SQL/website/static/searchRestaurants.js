function searchRestaurants() {
  let searchQuery = document.getElementById("search-input").value;
  let loadingSpinner = document.querySelector(".loading-spinner");
  let resultsContainer = document.getElementById("results-container");

  // Show the loading spinner
  loadingSpinner.style.display = "block";

  // Clear previous results
  resultsContainer.innerHTML = "";

  fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: searchQuery }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.recommendations) {
        renderRestaurantCards(data);
      } else if (data && data.error) {
        resultsContainer.textContent = data.error;
      } else {
        resultsContainer.textContent = "No results found.";
      }
      // Hide the loading spinner after the results are rendered
      loadingSpinner.style.display = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsContainer.textContent = "Error fetching results.";
      // Hide the loading spinner in case of an error
      loadingSpinner.style.display = "none";
    });
}
function renderRestaurantCards(data) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Clear previous results

  data.recommendations.forEach((restaurant) => {
    // Create card container
    const card = document.createElement("div");
    card.className = "restaurant-card";

    // Create and add image container
    const imageDiv = document.createElement("div");
    imageDiv.className = "card-image";

    // Create image scroll container
    const imageScrollContainer = document.createElement("div");
    imageScrollContainer.className = "image-scroll-container";

    // Create image elements for each photo ID
    restaurant.photo_ids.forEach((photoId, index) => {
      const imageUrl = `https://s3-media4.fl.yelpcdn.com/bphoto/${photoId}/o.jpg`;
      const imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      imageElement.alt = `Restaurant Image ${index + 1}`;
      if (index === 0) {
        imageElement.classList.add("active");
      }
      imageScrollContainer.appendChild(imageElement);
    });

    // Create scroll arrows
    const leftArrow = document.createElement("div");
    leftArrow.className = "scroll-arrow left-arrow";
    leftArrow.textContent = "<";
    const rightArrow = document.createElement("div");
    rightArrow.className = "scroll-arrow right-arrow";
    rightArrow.textContent = ">";

    // Check and update arrow visibility
    function updateArrows() {
      const activeImage = imageScrollContainer.querySelector("img.active");
      const isFirstImage =
        activeImage === imageScrollContainer.firstElementChild;
      const isLastImage = activeImage === imageScrollContainer.lastElementChild;
      leftArrow.style.display = isFirstImage ? "none" : "block";
      rightArrow.style.display = isLastImage ? "none" : "block";
    }

    // Initial arrow visibility check
    updateArrows();

    // Add event listeners to scroll arrows with arrow visibility update
    leftArrow.addEventListener("click", () => {
      const currentImage = imageScrollContainer.querySelector("img.active");
      const prevImage = currentImage.previousElementSibling;
      if (prevImage) {
        currentImage.classList.remove("active");
        prevImage.classList.add("active");
        updateArrows(); // Update arrows after changing image
      }
    });
    rightArrow.addEventListener("click", () => {
      const currentImage = imageScrollContainer.querySelector("img.active");
      const nextImage = currentImage.nextElementSibling;
      if (nextImage) {
        currentImage.classList.remove("active");
        nextImage.classList.add("active");
        updateArrows(); // Update arrows after changing image
      }
    });

    // Append image scroll container and arrows to image container
    imageDiv.appendChild(imageScrollContainer);
    if (restaurant.photo_ids.length > 1) {
      imageDiv.appendChild(leftArrow);
      imageDiv.appendChild(rightArrow);
    }

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
