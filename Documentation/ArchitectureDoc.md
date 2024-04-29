## Architecture Diagram

![Architecture Diagram](MunchArchitectureDiagram.jpg)

## Flow Explanation

The architecture diagram illustrates the flow of our system:

- **Public IP**: The public IP allows users to access the project's front end over the internet. This IP address is associated with the reverse proxy, facilitating secure and efficient communication.
- **Reverse Proxy**: Reverse proxy provides additional security features, helping to prevent unauthorized access and maintain secure communication.
- **Amazon VPC**: Amazon Virtual Private Cloud (VPC) offers a secure and isolated network environment for the project. It provides security features like firewalls and subnetting, ensuring secure communication between different components.
- **FrontEnd**:The interactive user interface where the users can input information and receive results from the application.The front end also connects to the backend by using APIs, which will enable user input the go to the backend and results from the backend would go through to the user.
- **User Input**: This refers to the information users provide through the front end. It includes search queries, preferences, or filters that guide the backend services in generating relevant results.
- **Amazon EC2**: Amazon Elastic Compute Cloud (EC2) provides scalable computing capacity. In this project, EC2 hosts the application's backend, running the core functions and handling interactions between the frontend and databases.
- **Amazon RDS**: Amazon Relational Database Service (RDS) is a managed database service. It securely stores and manages the project's backend data, including information from various databases. In this case, it will be managing the Yelp Database.
- **Yelp Database**: Our database stores information from Yelp, including restaurant data, reviews, and ratings. This yelp database is preprocessed by generative AI tools to get relevant topics and the respective ratings of those topics for the restaurant. The project's backend services retrieve data from this database, which is then processed and presented to users.
- **Input to Query**: This component converts user inputs into structured queries that can be sent to the backend services and databases.This will be done by a natural language processing application. Specifically, a natural language processing tool will make an initial simple query filtering datasets. Then, out of the filtered results and the enriched information, the application will rank the restaurants out of its relevance.
- **Bayesian Ranking**: The project uses a Bayesian ranking algorithm to order restaurants based on enriched dataset, their reviews and ratings. This ranking helps to provide users with a more accurate and reliable assessment of different restaurants.
- **Query Results**: Processes the responses from backend services and databases, converting them into user-friendly formats. These results include information like restaurant details, reviews, and rankings.
- **User Output**: This represents the information shown to the user, including restaurant details, reviews, rankings, and links. The output is designed to be user-friendly and accessible.The project's front end displays additional information, including tabs for different restaurants, images, and links. This provides users with a comprehensive view of each restaurant, aiding in their decision-making process.

[Download PDF](MunchArchitectureDiagram.pdf)
