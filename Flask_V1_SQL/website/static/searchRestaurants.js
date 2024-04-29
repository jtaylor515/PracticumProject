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
      if (data && data.recommendations && data.recommendations.length > 0) {
        renderRestaurantCards(data);
      } else {
        setTimeout(() => {
          // Check again if data is still empty after 3 seconds
          if (data && data.recommendations && data.recommendations.length === 0) {
            showNoResultsPopup();
          }
        }, 3000); // 3000 milliseconds = 3 seconds
      }
      loadingSpinner.style.display = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsContainer.textContent = "Error fetching results.";
      loadingSpinner.style.display = "none";
    });
}

function showNoResultsPopup() {
  const popup = document.createElement("div");
  popup.className = "no-results-popup";

  const message = document.createElement("p");
  message.textContent = "No results found for the entered query.";
  popup.appendChild(message);

  const suggestion = document.createElement("p");
  suggestion.textContent = "Try searching with fewer filters.";
  popup.appendChild(suggestion);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    popup.remove();
  });
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
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
      leftArrow.style.userSelect = "none";  // Prevent text selection
      leftArrow.style.cursor = "pointer";   // Suggest interactivity
      const rightArrow = document.createElement("div");
      rightArrow.className = "scroll-arrow right-arrow";
      rightArrow.textContent = ">";
      rightArrow.style.userSelect = "none";  // Prevent text selection
      rightArrow.style.cursor = "pointer";   // Suggest interactivity

      // Check and update arrow visibility
      function updateArrows() {
          const activeImage = imageScrollContainer.querySelector("img.active");
          const isFirstImage = activeImage === imageScrollContainer.firstElementChild;
          const isLastImage = activeImage === imageScrollContainer.lastElementChild;
          leftArrow.style.display = isFirstImage ? "none" : "block";
          rightArrow.style.display = isLastImage ? "none" : "block";
      }

      // Initial arrow visibility check
      updateArrows();

      // Add event listeners to scroll arrows with arrow visibility update
      leftArrow.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent event bubbling to the card
          const currentImage = imageScrollContainer.querySelector("img.active");
          const prevImage = currentImage.previousElementSibling;
          if (prevImage) {
              currentImage.classList.remove("active");
              prevImage.classList.add("active");
              updateArrows(); // Update arrows after changing image
          }
      });
      rightArrow.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent event bubbling to the card
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
      ratingElement.textContent = `${restaurant.stars} stars`;
      ratingReviewDiv.appendChild(ratingElement);

      const reviewCountElement = document.createElement("div");
      reviewCountElement.className = "review-count";
      reviewCountElement.textContent = `${restaurant.review_count} reviews`;
      ratingReviewDiv.appendChild(reviewCountElement);

      // Append rating and review container to info container
      infoDiv.appendChild(ratingReviewDiv);

      // Add categories with color-coded bubbles
      const categoriesDiv = document.createElement("div");
      categoriesDiv.className = "categories-container";

      Object.keys(restaurant.relevant_categories).forEach(category => {
          const categoryBubble = document.createElement("span");
          categoryBubble.className = "category-bubble";
          let categoryValue = restaurant.relevant_categories[category];

          // Adjust the styles for the category bubbles
          categoryBubble.style.padding = "4px 8px"; // Smaller padding
          categoryBubble.style.margin = "4px"; // Reduce margin for tighter layout
          categoryBubble.style.fontSize = "17px"; // Smaller font size
          categoryBubble.style.borderRadius = "10px"; // Adjust border radius for aesthetics

      
          if (typeof categoryValue === 'boolean') {
              // If the category value is boolean, display only the category name
              categoryBubble.innerHTML = `<strong>${category}</strong>`;
              categoryBubble.style.backgroundColor = categoryValue ? '#E65A4D' : '#EDEDED';
          } else if (categoryValue !== null) {
              // If the category value is not null and not boolean, display name and value
              categoryValue = categoryValue.toFixed(1); // Converts to string rounded to 1 decimal place
              categoryBubble.innerHTML = `<strong>${category}: ${categoryValue}</strong>`;
              categoryBubble.style.backgroundColor = getRatingColor(parseFloat(categoryValue));
          } else {
              // If the category value is null, display only the category name without a value
              categoryBubble.innerHTML = `<strong>${category}</strong>`;
              categoryBubble.style.backgroundColor = '#EDEDED';
          }
      
          categoriesDiv.appendChild(categoryBubble);
      });
      infoDiv.appendChild(categoriesDiv);

      // Add review text and stars
      const reviewText = truncateText(restaurant.review, 300); // Truncate review to 150 characters
      const reviewElement = document.createElement("div");
      reviewElement.className = "review";
      reviewElement.innerHTML = `<strong>Featured Review:</strong> <em>"${reviewText}"</em>`;
      infoDiv.appendChild(reviewElement);

      card.appendChild(infoDiv);

      // Append card to results container
      resultsContainer.appendChild(card);

      // Add click event listener to card
      card.addEventListener("click", () => {
        openRestaurantPopup(restaurant);
      });
  });
}

function getRatingColor(value) {
  const colorStart = {r: 237, g: 237, b: 237}; // #EDEDED (--bgdiff)
  const colorEnd = {r: 255, g: 111, b: 97}; // #FF6F61

  // Ensure value is between 1 and 5
  value = Math.max(1, Math.min(value, 5));

  // Calculate the color based on the value
  const ratio = (value - 1) / 4;
  const r = Math.round(colorStart.r + ratio * (colorEnd.r - colorStart.r));
  const g = Math.round(colorStart.g + ratio * (colorEnd.g - colorStart.g));
  const b = Math.round(colorStart.b + ratio * (colorEnd.b - colorStart.b));

  return `rgb(${r}, ${g}, ${b})`;
}


function openRestaurantPopup(restaurant) {

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.style.height = "73vh";
  modalContent.style.overflowY = "auto";
  modalContent.style.width = "65%";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
  modalContent.style.outline = "none";

  // name
  const nameElement = document.createElement("h1");
  nameElement.textContent = restaurant.name;
  nameElement.style.fontSize = "50px";
  nameElement.style.textAlign = "center";
  nameElement.style.outline = "none";
  modalContent.appendChild(nameElement);

  // Create and add the address element
  const addressElement = document.createElement("div");
  addressElement.textContent = `${restaurant.address}, ${restaurant.city}, ${restaurant.state}`;
  addressElement.style.marginBottom = "10px";
  addressElement.style.textAlign = "center";
  addressElement.style.outline = "none";
  modalContent.appendChild(addressElement);

  // Create a container for the image, categories/scores, and hours sections
  const modalContentContainer = document.createElement("div");
  modalContentContainer.style.display = "flex";
  modalContentContainer.style.justifyContent = "space-between";
  modalContentContainer.style.marginBottom = "20px";

  // Create and add image container
  const imageDiv = document.createElement("div");
  imageDiv.className = "card-image";
  imageDiv.style.width = "300px";
  imageDiv.style.height = "300px";
  imageDiv.style.marginRight = "20px";
  imageDiv.style.borderRadius = "8px";
  imageDiv.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  imageDiv.style.outline = "none";

  // Create image scroll container
  const imageScrollContainer = document.createElement("div");
  imageScrollContainer.className = "image-scroll-container";
  imageScrollContainer.style.borderRadius = "8px";
  imageScrollContainer.style.outline = "none";

  // Create image elements for each photo ID
  restaurant.photo_ids.forEach((photoId, index) => {
    const imageUrl = `https://s3-media4.fl.yelpcdn.com/bphoto/${photoId}/o.jpg`;
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = `Restaurant Image ${index + 1}`;
    imageElement.style.borderRadius = "8px";
    if (index === 0) {
      imageElement.classList.add("active");
    }
    imageScrollContainer.appendChild(imageElement);
  });

  // Create scroll arrows
  const leftArrow = document.createElement("div");
  leftArrow.className = "scroll-arrow left-arrow";
  leftArrow.textContent = "<";
  leftArrow.style.userSelect = "none";  // Prevent text selection
  leftArrow.style.cursor = "pointer";   // Suggest interactivity
  const rightArrow = document.createElement("div");
  rightArrow.className = "scroll-arrow right-arrow";
  rightArrow.textContent = ">";
  rightArrow.style.userSelect = "none";  // Prevent text selection
  rightArrow.style.cursor = "pointer";   // Suggest interactivity

  // Check and update arrow visibility
  function updateArrows() {
    const activeImage = imageScrollContainer.querySelector("img.active");
    const isFirstImage = activeImage === imageScrollContainer.firstElementChild;
    const isLastImage = activeImage === imageScrollContainer.lastElementChild;
    leftArrow.style.display = isFirstImage ? "none" : "block";
    rightArrow.style.display = isLastImage ? "none" : "block";
  }

  // Initial arrow visibility check
  updateArrows();

  // Add event listeners to scroll arrows with arrow visibility update
  leftArrow.addEventListener("click", (event) => {
    event.stopPropagation();
    const currentImage = imageScrollContainer.querySelector("img.active");
    const prevImage = currentImage.previousElementSibling;
    if (prevImage) {
      currentImage.classList.remove("active");
      prevImage.classList.add("active");
      updateArrows();
    }
  });
  rightArrow.addEventListener("click", (event) => {
    event.stopPropagation();
    const currentImage = imageScrollContainer.querySelector("img.active");
    const nextImage = currentImage.nextElementSibling;
    if (nextImage) {
      currentImage.classList.remove("active");
      nextImage.classList.add("active");
      updateArrows();
    }
  });

  // Append image scroll container and arrows to image container
  imageDiv.appendChild(imageScrollContainer);
  if (restaurant.photo_ids.length > 1) {
    imageDiv.appendChild(leftArrow);
    imageDiv.appendChild(rightArrow);
  }

  modalContentContainer.appendChild(imageDiv);

  // Create a container for the categories and scores section
  const categoriesScoresContainer = document.createElement("div");
  categoriesScoresContainer.style.width = "40%";
  categoriesScoresContainer.style.display = "flex";
  categoriesScoresContainer.style.flexDirection = "column";
  categoriesScoresContainer.style.alignItems = "center";
  categoriesScoresContainer.style.justifyContent = "center";
  categoriesScoresContainer.style.padding = "10px";

  // Add categories with color-coded bubbles
  const categoriesDiv = document.createElement("div");
  categoriesDiv.className = "categories-container";
  categoriesDiv.style.display = "flex";
  categoriesDiv.style.flexWrap = "wrap";
  categoriesDiv.style.justifyContent = "center";
  categoriesDiv.style.marginBottom = "10px";

  const maxBubbleSize = 95; // Maximum size for category bubbles
  const minBubbleSize = 30; // Minimum size for category bubbles
  const bubbleSize = Math.max(minBubbleSize, Math.min(maxBubbleSize, maxBubbleSize / Math.sqrt(Object.keys(restaurant.relevant_categories).length)));

  Object.keys(restaurant.relevant_categories).forEach(category => {
    const categoryBubble = document.createElement("span");
    categoryBubble.className = "category-bubble";
    categoryBubble.style.margin = "4px";
    categoryBubble.style.padding = "4px 8px"; // Smaller padding
    categoryBubble.style.borderRadius = "10px";
    categoryBubble.style.fontSize = `${bubbleSize * 0.5}px`;

    let categoryValue = restaurant.relevant_categories[category];

    if (typeof categoryValue === 'boolean') {
      categoryBubble.innerHTML = `<strong>${category}</strong>`;
      categoryBubble.style.backgroundColor = categoryValue ? '#E65A4D' : '#EDEDED';
    } else if (categoryValue !== null) {
      categoryValue = categoryValue.toFixed(1);
      categoryBubble.innerHTML = `<strong>${category}: ${categoryValue}</strong>`;
      categoryBubble.style.backgroundColor = getRatingColor(parseFloat(categoryValue));
    } else {
      categoryBubble.innerHTML = `<strong>${category}</strong>`;
      categoryBubble.style.backgroundColor = '#EDEDED';
    }

    categoriesDiv.appendChild(categoryBubble);
  });

  categoriesScoresContainer.appendChild(categoriesDiv);

  modalContentContainer.appendChild(categoriesScoresContainer);

  // Create and add the open hours
  const openHoursElement = document.createElement("div");
  openHoursElement.innerHTML = `<br><strong style="font-size: larger;">Hours:</strong><br>${formatHours(restaurant.hours)}`;
  openHoursElement.style.marginBottom = "20px";
  openHoursElement.style.whiteSpace = "pre-wrap";
  openHoursElement.style.textAlign = "center";
  openHoursElement.style.fontSize = "16px";
  openHoursElement.style.width = "30%";
  openHoursElement.style.outline = "none";
  modalContentContainer.appendChild(openHoursElement);

  modalContent.appendChild(modalContentContainer);

  // Create a container for the buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.marginBottom = "20px";

  // Create and add the location button
  const locationButton = document.createElement("button");
  locationButton.textContent = "Directions";
  locationButton.onclick = function () {
    const encodedAddress = encodeURIComponent(`${restaurant.address}, ${restaurant.city}, ${restaurant.state}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };
  locationButton.style.padding = "10px 20px";
  locationButton.style.border = "none";
  locationButton.style.borderRadius = "4px";
  locationButton.style.background = "#FF6F61";
  locationButton.style.color = "white";
  locationButton.style.cursor = "pointer";
  locationButton.style.fontFamily = "Roboto, sans-serif";
  locationButton.style.fontSize = "14px";
  locationButton.style.fontWeight = "500";
  locationButton.style.letterSpacing = "0.2px";
  locationButton.style.marginTop = "10px";
  locationButton.style.marginRight = "10px";
  locationButton.style.width = "150px";
  locationButton.style.transition = "box-shadow 0.3s, transform 0.3s";
  locationButton.addEventListener("mouseover", function() {
    this.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    this.style.transform = "translateY(-5px)";
  });
  locationButton.addEventListener("mouseout", function() {
    this.style.boxShadow = "none";
    this.style.transform = "translateY(0)";
  });
  buttonContainer.appendChild(locationButton);

  // Create and add the Google search button
  const googleSearchButton = document.createElement("button");
  googleSearchButton.textContent = "Search";
  googleSearchButton.onclick = function () {
    const searchQuery = `${restaurant.name} restaurant ${restaurant.city} ${restaurant.state}`;
    window.open(
      "https://www.google.com/search?q=" + encodeURIComponent(searchQuery),
      "_blank"
    );
  };
  googleSearchButton.style.padding = "10px 20px";
  googleSearchButton.style.border = "none";
  googleSearchButton.style.borderRadius = "4px";
  googleSearchButton.style.background = "#FF6F61";
  googleSearchButton.style.color = "white";
  googleSearchButton.style.cursor = "pointer";
  googleSearchButton.style.fontFamily = "Roboto, sans-serif";
  googleSearchButton.style.fontSize = "14px";
  googleSearchButton.style.fontWeight = "500";
  googleSearchButton.style.letterSpacing = "0.2px";
  googleSearchButton.style.marginTop = "10px";
  googleSearchButton.style.width = "150px";
  googleSearchButton.style.transition = "box-shadow 0.3s, transform 0.3s";
  googleSearchButton.addEventListener("mouseover", function() {
    this.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    this.style.transform = "translateY(-5px)";
  });
  googleSearchButton.addEventListener("mouseout", function() {
    this.style.boxShadow = "none";
    this.style.transform = "translateY(0)";
  });
  buttonContainer.appendChild(googleSearchButton);

  // Add the button container to the modal content
  modalContent.appendChild(buttonContainer);

  // Create a container for the elements
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.alignItems = "center";
  container.style.marginBottom = "20px";
  container.style.border = "3px solid #000";

  // Create and add the rating element
  const ratingElement = document.createElement("div");
  ratingElement.textContent = ` ${restaurant.review_stars} / 5`;
  ratingElement.style.marginBottom = "20px";
  ratingElement.style.fontSize = "30px";
  ratingElement.style.display = "flex";
  ratingElement.style.justifyContent = "center";
  ratingElement.style.alignItems = "center";
  ratingElement.style.flexGrow = "1";
  ratingElement.style.outline = "none";
  container.appendChild(ratingElement);

  // Create a container for the text review and review count elements
  const reviewContainer = document.createElement("div");
  reviewContainer.style.width = "70%";

  const reviewElement = document.createElement("div");
  reviewElement.innerHTML = `<strong>Featured Review:</strong> <em>"${restaurant.review}"</em>`;
  reviewElement.style.marginTop = "20px";
  reviewElement.style.marginBottom = "20px";
  reviewElement.style.fontSize = "16px";
  reviewElement.style.padding = "20px";
  reviewContainer.appendChild(reviewElement);

  // Add the review container to the main container
  container.appendChild(reviewContainer);

  // Add the main container to the modal content
  modalContent.appendChild(container);

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

const promptContainers = document.querySelectorAll(".prompt-container");

// Add a click event listener to each prompt container
promptContainers.forEach((container) => {
  container.addEventListener("click", () => {
    // Get the text inside the container
    const text = container.textContent.trim();

    // Update the value of the search input field with the prompt text
    const searchInput = document.getElementById("search-input");
    searchInput.value = text;

    // Call the searchRestaurants function
    searchRestaurants();
  });
});

function formatHours(hoursData) {
  if (!hoursData) {
    return "Hours not available";
  }

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let formattedHours = "";
  for (const day of daysOfWeek) {
    if (hoursData[day]) {
      const [openTime, closeTime] = hoursData[day].split("-");
      formattedHours += `${day}: ${formatTime(openTime)} - ${formatTime(closeTime)}<br>`;
    } else {
      formattedHours += `${day}: Closed<br>`;
    }
  }

  return formattedHours;
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const formattedHours = parseInt(hours, 10);
  const formattedMinutes = minutes === "0" ? "00" : minutes;
  const period = formattedHours >= 12 ? "PM" : "AM";
  const displayHours = formattedHours % 12 || 12;
  return `${displayHours}:${formattedMinutes} ${period}`;
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
  }
  return text;
}
