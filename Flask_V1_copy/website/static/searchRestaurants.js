searchRestraunts 
function searchRestaurants() {
  let searchQuery = document.getElementById("search-input").value;
  let loadingSpinner = document.querySelector(".loading-spinner");
  loadingSpinner.style.display = "flex"; // Show the loading spinner

  // Dummy data
  let data = {
    recommendations: [
      { name: "Restaurant 1", address: "Address 1", rating: 4.5 },
      { name: "Restaurant 2", address: "Address 2", rating: 4.0 },
      { name: "Restaurant 3", address: "Address 3", rating: 3.5 },
    ],
  };

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

    // Add click event listener to card
    card.addEventListener("click", () => {
      openRestaurantPopup(restaurant);
    });
  });
}


function openRestaurantPopup(restaurant) {
  console.log('inside');
  console.log(restaurant); // {name: 'Restaurant 1', address: 'Address 1', rating: 4.5}

  // Create the modal container
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  const modalContent = document.createElement("div");
modalContent.style.backgroundColor = "#fff";
modalContent.style.padding = "20px";
modalContent.style.borderRadius = "8px";
modalContent.style.width = "70%"; // Adjust as needed
modalContent.style.height = "70%"; // Adjust as needed
modalContent.style.overflow = "auto"; // Add scroll if content is larger than modal
modalContent.style.display = "flex"; // Add this line
modalContent.style.justifyContent = "space-between"; // Add this line
// modalContent.style.flexDirection = "column"; // Add this line

// Create and add the restaurant name
const nameElement = document.createElement("h2");
nameElement.textContent = restaurant.name;
modalContent.appendChild(nameElement);

// Create and add the restaurant address
const addressElement = document.createElement("p");
addressElement.textContent = `Address: ${restaurant.address}`;
modalContent.appendChild(addressElement);

  // Create and add the restaurant rating
  const ratingElement = document.createElement("p");
  ratingElement.textContent = `Rating: ${restaurant.rating}`;
  modalContent.appendChild(ratingElement);

  // Append the modal content to the modal container
  modal.appendChild(modalContent);

  // Append the modal to the document body
  document.body.appendChild(modal);

  // Add a click event listener to close the modal when clicked outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}


