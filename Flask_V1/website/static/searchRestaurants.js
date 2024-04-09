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
