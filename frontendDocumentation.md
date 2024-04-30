Front End Documentation 

Introduction 
Welcome to the front-end documentation for our web application! This documentation provides a comprehensive overview of the technologies used, file structure, and how to run the application locally. Our web application is designed to help users discover and explore restaurants, providing a seamless user experience.

Technologies used - Html/Css, JS, Git/Github.

File Structure
cd Flask_V1_SQL, run with command python main.py 

Inside the Wwebsite folder is where all JS functions and html / css code is.

Inside website Folder We have 2 important folders for front-end development:
Static and Templates folder.

Inside Static Folder we have:
searchRestaurants.js 

Inside Templates folder we have:
base.html
home.html
login.html
reservations.html
restaurant_search.html
sign_up.html

Static Folder explained:
The searchRestaurants() function handles the search functionality for restaurants. It first retrieves the search query from an input field, displays a loading spinner, and clears any previous search results. Then, it makes a POST request to a server-side endpoint (/api/search) with the search query as JSON. 

 Upon receiving a response, it checks if there are any recommendations and calls renderRestaurantCards(data) to display the restaurant cards. If there are no results, it waits for 3 seconds before showing a "No results found" popup. If there's an error during the fetch, it displays an error message. 

The showNoResultsPopup() function creates and displays the popup. 

The renderRestaurantCards(data) function dynamically created HTML elements to display restaurant information, including images, ratings, reviews, and categories.

 Finally, the openRestaurantPopup(restaurant) function creates and displays a modal with detailed information about a specific restaurant, including images, categories, hours, and buttons for directions and Google search.

We also have central style.css for all of our components, to style our modals, html pages, ect.

Files inside Template folder explained 
base.html: This is the base template that serves as the foundation for all other pages. It includes the navigation bar, which contains links to different sections of the website, the overall structure of the website (e.g., header, main content area, footer), and footer with links to social media profiles and contact information.
home.html: This template represents the hero section of the app, which is the main area where users land when they visit the website. It displays all the results from the model, which likely includes a list of restaurants. Users can also click on pre-made queries to populate the search box with specific terms. This template extends the base.html template, meaning it inherits the structure and styling from base.html.
login.html: This template provides the main page for the login form. Users can enter their login information (e.g., username, password) to access their account. This page likely includes form fields for user input and a submit button.
restaurant_search.html: This template creates a simple page titled "Restaurant Search Page." It includes a heading to indicate the purpose of the page, a line break for visual separation, and an image centered on the page. This page may also include a search bar or other elements related to searching for restaurants.
sign_up.html: This template represents the sign-up page where users can input their information to create a user account. The page likely includes form fields for users to enter their details (e.g., name, email, password) and a submit button. It's important to note that when users are logged out, they don’t have access to their information, emphasizing the need to sign up or log in to access certain features or content.
















